'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Report } from '@/components/dashboard/types'
import { MonthlyCards } from '@/components/statistics/monthly-cards'

const supabase = createClient()

export default function Statistics() {
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data, error } = await supabase.from('reports').select('*')
                if (error) throw error
                setReports(data || [])
            } catch (err: any) {
                setError(err.message || 'Failed to load reports')
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
    }, [])

    if (loading) {
        return <div className="p-8 flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
    }

    if (error) {
        return <div className="p-8 text-red-500">Error loading statistics: {error}</div>
    }

    return (
        <div className="container mx-auto py-10 px-4 sm:px-8">
            <div className="mb-6 fade">
                <h1 className="text-3xl font-bold tracking-tight">Statistics Overview</h1>
                <p className="text-muted-foreground mt-1">Monthly report metrics and trends</p>
            </div>
            
            <MonthlyCards reports={reports} />
        </div>
    )
}