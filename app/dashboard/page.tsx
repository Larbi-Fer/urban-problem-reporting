'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Report, Attachment } from '@/components/dashboard/types'
import { DashboardFilters } from '@/components/dashboard/dashboard-filters'
import { ReportsTable } from '@/components/dashboard/reports-table'
import { ReportDrawer } from '@/components/dashboard/report-drawer'
import { StatusCards } from '@/components/dashboard/status-cards'
import { useRouter } from 'next/navigation'

const supabase = createClient()

export default function Dashboard() {
    const router = useRouter()
    const [reports, setReports] = useState<Report[]>([])
    const [allReports, setAllReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [priorityFilter, setPriorityFilter] = useState<string>('all')

    const [selectedReport, setSelectedReport] = useState<Report | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [attachmentsLoading, setAttachmentsLoading] = useState(false)

    useEffect(() => {
        (async () => {
            const { data, error } = await supabase.auth.getUser()
            if (error || !data.user) {
                router.push('/auth/login')
            } else if (data.user.user_metadata?.role !== 'admin') {
                router.push('/issue')
            }
        })()
    }, [])

    const fetchReports = async () => {
        setLoading(true)
        setError(null)
        try {
            // Fetch all reports for status cards (unfiltered)
            const { data: allData } = await supabase.from('reports').select('*')
            setAllReports(allData || [])

            let query = supabase.from('reports').select('*').order('created_at', { ascending: false })

            if (statusFilter !== 'all') {
                query = query.eq('status', parseInt(statusFilter))
            }
            if (priorityFilter !== 'all') {
                query = query.eq('priority', parseInt(priorityFilter))
            }

            const { data, error } = await query

            if (error) throw error
            setReports(data || [])
        } catch (err: any) {
            setError(err.message || 'Failed to load reports')
        } finally {
            setLoading(false)
        }
    }

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

    const handleUpdateStatus = async (reportId: string, newStatus: number, teamLeaderId?: string | null, isResolvedVal?: boolean | null) => {
        try {
            const statusDate = {
                ...(newStatus === 1 ? { under_investigation_at: new Date().toISOString() } : {}),
                ...(newStatus === 2 ? { assigned_to_at: new Date().toISOString(), team_leader: teamLeaderId } : {}),
                ...(newStatus === 3 ? { work_in_progress_at: new Date().toISOString() } : {}),
                ...(newStatus === 4 ? { resolved_at: new Date().toISOString() } : {})
            }
            const updatePayload: any = {
                status: newStatus,
                ...statusDate
            }
            if (isResolvedVal !== undefined) {
                updatePayload.is_resolved = isResolvedVal
            }
            const { error } = await supabase
                .from('reports')
                .update(updatePayload)
                .eq('id', reportId)

            if (error) throw error

            // Update local state
            setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, status: newStatus, ...statusDate, ...(isResolvedVal !== undefined ? { is_resolved: isResolvedVal } : {}) } : r))
            setAllReports((prev) => prev.map((r) => r.id === reportId ? { ...r, status: newStatus, ...statusDate, ...(isResolvedVal !== undefined ? { is_resolved: isResolvedVal } : {}) } : r))
            if (selectedReport?.id === reportId) {
                setSelectedReport({ ...selectedReport, status: newStatus, ...statusDate, ...(isResolvedVal !== undefined ? { is_resolved: isResolvedVal } : {}) })
            }
        } catch (err) {
            console.error('Failed to update status', err)
        }
    }

    const handleUpdatePriority = async (reportId: string, newPriority: number) => {
        try {
            const { error } = await supabase
                .from('reports')
                .update({ priority: newPriority })
                .eq('id', reportId)

            if (error) throw error

            setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, priority: newPriority } : r))
            setAllReports((prev) => prev.map((r) => r.id === reportId ? { ...r, priority: newPriority } : r))
            if (selectedReport?.id === reportId) {
                setSelectedReport({ ...selectedReport, priority: newPriority })
            }
        } catch (err) {
            console.error('Failed to update priority', err)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [statusFilter, priorityFilter])

    const handleRowClick = (report: Report) => {
        setSelectedReport(report)
        setIsSheetOpen(true)
        fetchAttachments(report.id)
    }

    const handleSheetOpenChange = (open: boolean) => {
        setIsSheetOpen(open)
        if (!open) {
            setTimeout(() => {
                setSelectedReport(null)
                setAttachments([])
            }, 300) // Clear after animation
        }
    }

    const getImageUrl = (path: string) => {
        const cleanPath = path.startsWith('Attachments/') ? path.replace('Attachments/', '') : path;
        const { data } = supabase.storage.from('Attachments').getPublicUrl(cleanPath)
        return data.publicUrl
    }

    return (
        <div className="container mx-auto py-10 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className='fade'>
                    <h1 className="text-3xl font-bold tracking-tight">Urban Issues Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage and view reported problems</p>
                </div>
                <DashboardFilters
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    priorityFilter={priorityFilter}
                    setPriorityFilter={setPriorityFilter}
                />
            </div>

            <StatusCards reports={allReports} />

            <ReportsTable
                reports={reports}
                loading={loading}
                error={error}
                onRowClick={handleRowClick}
                selectedId={selectedReport?.id}
            />

            <ReportDrawer
                report={selectedReport}
                attachments={attachments}
                loading={attachmentsLoading}
                isOpen={isSheetOpen}
                onOpenChange={handleSheetOpenChange}
                getImageUrl={getImageUrl}
                onUpdateStatus={handleUpdateStatus}
                onUpdatePriority={handleUpdatePriority}
            />
        </div>
    )
}