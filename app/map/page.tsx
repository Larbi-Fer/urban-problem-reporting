'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { Report, statusMap, priorityMap } from '@/components/dashboard/types'
import { Loader2, ArrowLeft, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
// We need to import getCoordinates type safely. Wait, getCoordinates is exported from map-viewer, but importing it directly from a dynamic component file might be problematic if it imports Leaflet on server.
// It's safer to recreate getCoordinates here or move it to a utils file. I will recreate it here to avoid SSR issues with Leaflet from the map-viewer file.

function getCoordinates(locationStr: string): [number, number] | null {
    if (!locationStr) return null;
    try {
        const parsed = JSON.parse(locationStr)
        if (parsed && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
            return [parsed.latitude, parsed.longitude]
        }
    } catch (e) {
        // If it's not valid JSON or fails to parse, return null
    }
    return null
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Dynamically import the map component with SSR disabled
const MapViewer = dynamic(() => import('@/components/map/map-viewer'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-muted/20">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
        </div>
    ),
})

export default function MapPage() {
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [mapBounds, setMapBounds] = useState<any>(null) // Type will be L.LatLngBounds
    const [mapCenter, setMapCenter] = useState<any>(null) // Type will be L.LatLng
    
    const supabase = createClient()

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select('*')
                
                if (error) throw error
                if (data) setReports(data)
            } catch (error) {
                console.error('Error fetching reports for map:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
    }, [])

    const handleBoundsChange = useCallback((bounds: any, center: any) => {
        setMapBounds(bounds)
        setMapCenter(center)
    }, [])

    const visibleReports = useMemo(() => {
        if (!mapBounds || !mapCenter || reports.length === 0) return []

        const visible = reports.filter(report => {
            const coords = getCoordinates(report.location)
            if (!coords) return false
            const [lat, lng] = coords
            // bounds.contains needs LatLng object, but we can do a simple bound check manually or use Leaflet.
            // Since we receive bounds object from Leaflet, it has contains() method.
            try {
                return mapBounds.contains([lat, lng])
            } catch (e) {
                return false
            }
        })

        // Sort by distance to center
        return visible.sort((a, b) => {
            const coordsA = getCoordinates(a.location)!
            const coordsB = getCoordinates(b.location)!
            const distA = getDistance(mapCenter.lat, mapCenter.lng, coordsA[0], coordsA[1])
            const distB = getDistance(mapCenter.lat, mapCenter.lng, coordsB[0], coordsB[1])
            return distA - distB
        })
    }, [reports, mapBounds, mapCenter])

    return (
        <div className="w-full h-screen flex flex-col sm:flex-row bg-background overflow-hidden">
            {/* Sidebar for List */}
            <div className="w-full sm:w-[400px] h-1/2 sm:h-full flex flex-col border-r bg-background/95 backdrop-blur z-10 shadow-xl relative order-2 sm:order-1">
                <div className="p-4 border-b shrink-0 flex items-center gap-3">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Urban Issues Map</h1>
                        <p className="text-xs text-muted-foreground">
                            {visibleReports.length} problems in view
                        </p>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : visibleReports.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground flex flex-col items-center gap-2">
                            <MapPin className="h-8 w-8 opacity-20" />
                            <p className="text-sm">No problems found in this area.</p>
                            <p className="text-xs">Try moving or zooming the map.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 pb-8">
                            {visibleReports.map((report) => {
                                const statusInfo = statusMap[report.status] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' }
                                const priorityInfo = priorityMap[report.priority] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' }
                                
                                // Calculate distance for display
                                let distStr = ""
                                if (mapCenter) {
                                    const coords = getCoordinates(report.location)!
                                    const dist = getDistance(mapCenter.lat, mapCenter.lng, coords[0], coords[1])
                                    distStr = dist < 1 ? `${Math.round(dist * 1000)}m away` : `${dist.toFixed(1)}km away`
                                }

                                return (
                                    <div key={report.id} className="p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors shadow-sm">
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <h3 className="font-semibold text-sm line-clamp-2">{report.title}</h3>
                                            {distStr && <span className="text-[10px] text-muted-foreground font-medium shrink-0 bg-muted px-2 py-1 rounded-full">{distStr}</span>}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                            {report.description}
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            <Badge variant="secondary" className={`text-[10px] h-5 ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </Badge>
                                            <Badge variant="outline" className={`text-[10px] h-5 ${priorityInfo.color}`}>
                                                {priorityInfo.label}
                                            </Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Map Area */}
            <div className="flex-1 w-full h-1/2 sm:h-full z-0 order-1 sm:order-2">
                <MapViewer reports={reports} onBoundsChange={handleBoundsChange} />
            </div>
        </div>
    )
}