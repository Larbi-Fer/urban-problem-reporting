'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Report, statusMap, priorityMap } from '@/components/dashboard/types'
import { Badge } from '@/components/ui/badge'

// Fix Leaflet default icon issue in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewerProps {
    reports: Report[]
    onBoundsChange?: (bounds: L.LatLngBounds, center: L.LatLng) => void
}

function MapEvents({ onBoundsChange }: { onBoundsChange?: (bounds: L.LatLngBounds, center: L.LatLng) => void }) {
    const map = useMapEvents({
        moveend: () => {
            if (onBoundsChange) {
                onBoundsChange(map.getBounds(), map.getCenter())
            }
        }
    })

    useEffect(() => {
        if (map && onBoundsChange) {
            onBoundsChange(map.getBounds(), map.getCenter())
        }
    }, [map, onBoundsChange])

    return null
}

export default function MapViewer({ reports, onBoundsChange }: MapViewerProps) {
    // Default center for the map if no valid coordinates are found (e.g., Algiers)
    const defaultCenter: [number, number] = [36.7525, 3.04197]

    // Find the first report with valid coordinates to center the map
    const firstValidReport = reports.find(r => getCoordinates(r.location) !== null)
    const mapCenter = firstValidReport 
        ? getCoordinates(firstValidReport.location)! 
        : defaultCenter

    return (
        <div className="w-full h-full relative z-0">
            <MapContainer 
                center={mapCenter} 
                zoom={12} 
                scrollWheelZoom={true} 
                className="w-full h-full absolute inset-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents onBoundsChange={onBoundsChange} />
                {reports.map((report) => {
                    const coords = getCoordinates(report.location)
                    if (!coords) return null

                    const statusInfo = statusMap[report.status] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' }
                    const priorityInfo = priorityMap[report.priority] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' }

                    return (
                        <Marker key={report.id} position={coords}>
                            <Popup className="rounded-xl shadow-lg border-0 p-0 overflow-hidden min-w-[250px]">
                                <div className="p-4 bg-background">
                                    <h3 className="font-semibold text-lg mb-2 text-foreground">{report.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{report.description}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        <Badge variant="secondary" className={statusInfo.color}>
                                            {statusInfo.label}
                                        </Badge>
                                        <Badge variant="outline" className={priorityInfo.color}>
                                            {priorityInfo.label}
                                        </Badge>
                                    </div>
                                    <div className="mt-3 text-xs text-muted-foreground/70">
                                        Reported on {new Date(report.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    )
}

export function getCoordinates(locationStr: string): [number, number] | null {
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
