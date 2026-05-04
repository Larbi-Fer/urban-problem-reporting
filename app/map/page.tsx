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
import { ReportDetails } from '@/components/map/report-details'
import { Attachment } from '@/components/dashboard/types'
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
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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


    const [openPanel, setOpenPanel] = useState(true)
    const [selectedReport, setSelectedReport] = useState<Report | null>(null)
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [attachmentsLoading, setAttachmentsLoading] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        document.body.style.overflow = 'hidden'
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

    const fetchAttachments = async (issueId: string) => {
        setAttachmentsLoading(true)
        try {
            const { data, error } = await supabase
                .from('attachments')
                .select('*')
                .eq('issue_id', issueId)

            if (error) throw error
            setAttachments(data || [])
        } catch (err) {
            console.error('Failed to load attachments', err)
        } finally {
            setAttachmentsLoading(false)
        }
    }

    const handleUpdateStatus = async (reportId: string, newStatus: number) => {
        try {
            const { error } = await supabase
                .from('reports')
                .update({ status: newStatus })
                .eq('id', reportId)

            if (error) throw error

            setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, status: newStatus } : r))
            if (selectedReport?.id === reportId) {
                setSelectedReport({ ...selectedReport, status: newStatus })
            }
        } catch (err) {
            console.error('Failed to update status', err)
        }
    }

    const getImageUrl = (path: string) => {
        const cleanPath = path.startsWith('Attachments/') ? path.replace('Attachments/', '') : path;
        const { data } = supabase.storage.from('Attachments').getPublicUrl(cleanPath)
        return data.publicUrl
    }

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
            <Button onClick={() => setOpenPanel(!openPanel)} variant='secondary'
                className={`absolute top-1/2 hidden sm:block h-20 w-5 bg-neutral-200/60 rounded-none z-20 p-0 transition-all duration-300 border-r border-2 border-gray-300 font-bold
                    ${openPanel ? "right-[407px]" : "right-0 rotate-180"}`
                }
            >{'>'}</Button>
            <div
                className={`w-full sm:w-[400px] h-1/2 sm:h-[calc(100%-16px)] flex flex-col border-r bg-neutral-200/60 border-2 border-gray-300 backdrop-blur z-10 shadow-xl order-2 sm:order-1 absolute top-2 rounded-2xl overflow-hidden transition-all duration-300
                    ${openPanel ? "right-2" : "-right-[420px]"}`
                }
            >
                <div className={`flex w-[200%] h-full transition-transform duration-500 ease-in-out ${selectedReport ? '-translate-x-1/2' : 'translate-x-0'}`}>
                    {/* List Panel */}
                    <div className="w-1/2 h-full flex flex-col overflow-auto">
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
                                            <div
                                                key={report.id}
                                                onClick={() => {
                                                    setSelectedReport(report)
                                                    fetchAttachments(report.id)
                                                }}
                                                className="p-4 rounded-xl border bg-card/50 hover:bg-accent/50 transition-colors shadow-sm cursor-pointer group"
                                            >
                                                <div className="flex justify-between items-start mb-2 gap-2">
                                                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{report.title}</h3>
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

                    {/* Details Panel */}
                    <div className="w-1/2 h-full border-l">
                        {selectedReport && (
                            <ReportDetails
                                report={selectedReport}
                                attachments={attachments}
                                loading={attachmentsLoading}
                                getImageUrl={getImageUrl}
                                onUpdateStatus={handleUpdateStatus}
                                onBack={() => setSelectedReport(null)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 w-full h-1/2 sm:h-full z-0 order-1 sm:order-2">
                <MapViewer reports={reports} onBoundsChange={handleBoundsChange} selectedReportId={selectedReport?.id} />
            </div>
        </div>
    )
}