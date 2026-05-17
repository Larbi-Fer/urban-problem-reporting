'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Report } from '@/components/dashboard/types'

// ----- Custom SVG marker icons -----
// Leaflet requires L.DivIcon / L.Icon objects — React elements cannot be used here.
function createMarkerIcon(selected: boolean): L.DivIcon {
    const size = selected ? 36 : 28
    const fill = selected ? '#f97316' : '#3b82f6'   // orange-500 : blue-500
    const stroke = selected ? '#c2410c' : '#1d4ed8'  // orange-700 : blue-700

    // Inline SVG string (no React, no JSX — pure HTML string for L.divIcon)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/>
        <circle cx="12" cy="10" r="3" fill="white" stroke="none"/>
    </svg>`

    return L.divIcon({
        html: svg,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
    })
}

const defaultIcon = createMarkerIcon(false)
const selectedIcon = createMarkerIcon(true)

// ----- Map sub-components -----
interface MapViewerProps {
    reports: Report[]
    onBoundsChange?: (bounds: L.LatLngBounds, center: L.LatLng) => void
    selectedReportId?: string | null
    onReportSelect?: (report: Report) => void
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

function MapFocus({ selectedReportId, reports }: { selectedReportId?: string | null, reports: Report[] }) {
    const map = useMap()

    useEffect(() => {
        if (selectedReportId) {
            const report = reports.find(r => r.id === selectedReportId)
            if (report) {
                const coords = getCoordinates(report.location)
                if (coords) {
                    map.flyTo(coords, 16, { duration: 1.5 })
                }
            }
        }
    }, [selectedReportId, reports, map])

    return null
}

// ----- Main component -----
export default function MapViewer({ reports, onBoundsChange, selectedReportId, onReportSelect }: MapViewerProps) {
    const defaultCenter: [number, number] = [36.7525, 3.04197]

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
                <MapFocus selectedReportId={selectedReportId} reports={reports} />
                {reports.map((report) => {
                    const coords = getCoordinates(report.location)
                    if (!coords) return null

                    const isSelected = report.id === selectedReportId

                    return (
                        <Marker
                            key={report.id}
                            position={coords}
                            icon={isSelected ? selectedIcon : defaultIcon}
                            zIndexOffset={isSelected ? 1000 : 0}
                            eventHandlers={{
                                click: () => {
                                    if (onReportSelect) onReportSelect(report)
                                }
                            }}
                        />
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
        // Not valid JSON
    }
    return null
}
