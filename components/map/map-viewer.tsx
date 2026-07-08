'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Report } from '@/components/dashboard/types'
import { Card } from '../ui/card'
import { Map, MapControls, MapMarker, MapRef, MarkerContent, MarkerTooltip, useMap } from '../ui/map'
import { MapPinIcon } from 'lucide-react'
import { LngLat, LngLatBounds } from 'maplibre-gl'

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
    onBoundsChange?: (bounds: LngLatBounds, center: LngLat) => void
    selectedReportId?: string | null
    onReportSelect?: (report: Report) => void
}

function MapEvents({ onBoundsChange }: { onBoundsChange?: (bounds: LngLatBounds, center: LngLat) => void }) {
    const { map, isLoaded } = useMap();

    // const map = useMapEvents({
    //     moveend: () => {
    //         if (onBoundsChange) {
    //             onBoundsChange(map.getBounds(), map.getCenter())
    //         }
    //     }
    // })

    useEffect(() => {
        if (!map || !isLoaded) return;

        const handleMove = () => {
            if (onBoundsChange) {
                onBoundsChange(map.getBounds(), map.getCenter());
            }
        }

        // Also listen to moveend events
        map.on('moveend', handleMove);

        return () => {
            map.off('moveend', handleMove);
        };
    }, [map, isLoaded, onBoundsChange])

    return null
}

function MapFocus({ selectedReportId, reports }: { selectedReportId?: string | null, reports: Report[] }) {
    const { map } = useMap()

    useEffect(() => {
        if (selectedReportId) {
            const report = reports.find(r => r.id === selectedReportId)
            if (report) {
                const coords = getCoordinates(report.location)
                if (coords) {
                    map?.flyTo({ center: [coords[1], coords[0]], zoom: 15, duration: 1500 })
                }
            }
        }
    }, [selectedReportId, reports, map])

    return null
}

// ----- Main component -----
export default function MapViewer({ reports, onBoundsChange, selectedReportId, onReportSelect }: MapViewerProps) {
    const defaultCenter: [number, number] = [36.7525, 3.04197]
    const mapRef = useRef<MapRef>(null);


    const firstValidReport = reports.find(r => getCoordinates(r.location) !== null)
    const mapCenter = firstValidReport
        ? getCoordinates(firstValidReport.location)!
        : defaultCenter

    return (
        <Card className="w-full h-full relative z-0 p-0 rounded-none">
            <Map center={[-2.221791572088887, 31.60790662046916]} zoom={14} theme='light' ref={mapRef}>
                {/* <Map center={[31, -2]} zoom={12} theme='light'> */}
                <MapControls position="top-left" />
                <MapEvents onBoundsChange={onBoundsChange} />
                <MapFocus selectedReportId={selectedReportId} reports={reports} />
                {reports.map((report) => {
                    const coords = getCoordinates(report.location)
                    if (!coords) return null

                    const isSelected = report.id === selectedReportId

                    return (
                        <MapMarker
                            key={report.id}
                            longitude={coords[1]}
                            latitude={coords[0]}
                            onClick={() => {
                                if (onReportSelect) onReportSelect(report)
                                // mapRef.current?.flyTo({ center: [coords[1], coords[0]], zoom: 15, duration: 1500 })
                            }}
                        >
                            <MarkerContent className={isSelected ? 'z-1000' : 'z-10'}>
                                {isSelected ?
                                    <MapPinIcon fill='#ccf' stroke='#f55' size={30} className='-translate-y-3.5' />
                                    :
                                    <MapPinIcon fill='#ccf' stroke='#55f' className='-translate-y-3' />
                                }
                            </MarkerContent>
                            <MarkerTooltip>{report.title}</MarkerTooltip>
                        </MapMarker>
                    )
                })}
            </Map>
        </Card>
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
