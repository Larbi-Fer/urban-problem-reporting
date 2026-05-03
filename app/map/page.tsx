'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { Report } from '@/components/dashboard/types'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Dynamically import the map component with SSR disabled
const MapViewer = dynamic(() => import('@/components/map/map-viewer'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-screen flex items-center justify-center bg-muted/20">
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

    return (
        <div className="w-full h-screen flex flex-col bg-background relative overflow-hidden">
            {/* Floating Header */}
            <div className="absolute top-0 left-0 w-full z-[1000] p-4 pointer-events-none flex justify-between items-start">
                <div className="bg-background/90 backdrop-blur-md border shadow-lg rounded-xl p-4 sm:p-5 pointer-events-auto max-w-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold tracking-tight">Urban Issues Map</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {loading ? 'Loading reports...' : `Displaying ${reports.length} reported problems across the city.`}
                    </p>
                </div>
            </div>
            
            {/* Full-screen Map */}
            <div className="flex-1 w-full h-full z-0">
                <MapViewer reports={reports} />
            </div>
        </div>
    )
}