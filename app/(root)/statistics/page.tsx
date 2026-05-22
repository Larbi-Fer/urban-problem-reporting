'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Report } from '@/components/dashboard/types'
import { MonthlyCards } from '@/components/statistics/monthly-cards'
import { StatusDistributionChart } from '@/components/statistics/status-distribution-chart'
import { MonthlyReportsChart } from '@/components/statistics/monthly-reports-chart'
import { TasksEvolutionChart } from '@/components/statistics/tasks-evolution-chart'
import { Skeleton } from '@/components/ui/skeleton'

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
        return (
            <div className="container mx-auto py-10 px-4 sm:px-8">
                <div className="mb-6 fade">
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-[140px] w-full rounded-2xl" />)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div className="lg:col-span-1">
                        <Skeleton className="h-[400px] w-full rounded-2xl" />
                    </div>
                    <div className="lg:col-span-1">
                        <Skeleton className="h-[400px] w-full rounded-2xl" />
                    </div>
                    <div className="lg:col-span-2">
                        <Skeleton className="h-[400px] w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return <div className="p-8 text-red-500">Error loading statistics: {error}</div>
    }

    return (
        <div className="container mx-auto py-10 px-4 sm:px-8">
            <div className="mb-6 fade">
                <h1 className="text-3xl font-bold w-fit tracking-tight bg-linear-to-tr from-neutral-900 via-neutral-900/70 to-neutral-900 bg-clip-text text-transparent">Statistics Overview</h1>
                <p className="text-muted-foreground mt-1">Monthly report metrics and trends</p>
            </div>

            <MonthlyCards reports={reports} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="lg:col-span-1">
                    <StatusDistributionChart reports={reports} />
                </div>
                <div className="lg:col-span-1">
                    <MonthlyReportsChart reports={reports} />
                </div>
                <div className="lg:col-span-2">
                    <TasksEvolutionChart reports={reports} />
                </div>
            </div>
        </div>
    )
}