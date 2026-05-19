import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the Map component with ssr: false to prevent 'window is not defined' errors
const DynamicMap = dynamic(() => import('@/components/dashboard/map'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted/50 flex items-center justify-center text-muted-foreground animate-pulse">Loading map...</div>
})
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { getModerators } from '@/app/admin/moderators/actions'

import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, ClipboardList, Search, Wrench, CheckCircle2, BadgeIcon } from 'lucide-react'
import { Report, Attachment, statusMap } from './types'
import {
    Timeline,
    TimelineContent,
    TimelineDate,
    TimelineHeader,
    TimelineIndicator,
    TimelineItem,
    TimelineSeparator,
    TimelineTitle,
} from '@/components/reui/timeline'

function ReportTimeline({ report }: { report: Report }) {
    const steps = [
        {
            label: 'Submitted',
            description: 'Report received and logged.',
            date: report.created_at,
            icon: <ClipboardList className="h-2.5 w-2.5" />,
        },
        {
            label: 'Under Investigation',
            description: 'Authorities are reviewing the report.',
            date: report.under_investigation_at,
            icon: <Search className="h-2.5 w-2.5" />,
        },
        {
            label: 'Leader assigned',
            description: 'A team leader has been assigned to the report.',
            date: report.assigned_to_at,
            icon: <BadgeIcon className="h-2.5 w-2.5" />
        },
        {
            label: 'Work in Progress',
            description: 'Active work has started on the issue.',
            date: report.work_in_progress_at,
            icon: <Wrench className="h-2.5 w-2.5" />,
        },
        {
            label: 'Resolved',
            description: 'The issue has been fully resolved.',
            date: report.resolved_at,
            icon: <CheckCircle2 className="h-2.5 w-2.5" />,
        },
    ]

    const activeStep = steps.reduce((acc, step, idx) => (step.date ? idx + 1 : acc), 0)

    return (
        <Timeline value={activeStep} className="ps-2">
            {steps.map((step, idx) => {
                const done = !!step.date
                return (
                    <TimelineItem key={step.label} step={idx + 1}>
                        <TimelineSeparator />
                        <TimelineIndicator
                            className={
                                done
                                    ? 'bg-primary border-primary flex items-center justify-center text-primary-foreground'
                                    : 'bg-muted border-muted-foreground/30 flex items-center justify-center'
                            }
                        >
                            <span className={done ? 'text-primary-foreground' : 'text-muted-foreground/50'}>
                                {step.icon}
                            </span>
                        </TimelineIndicator>
                        <TimelineHeader>
                            <TimelineTitle className={done ? 'text-foreground' : 'text-muted-foreground'}>
                                {step.label}
                            </TimelineTitle>
                            {done && (
                                <TimelineDate>
                                    {new Date(step.date!).toLocaleString()}
                                </TimelineDate>
                            )}
                        </TimelineHeader>
                        <TimelineContent className={done ? 'text-muted-foreground' : 'text-muted-foreground/40'}>
                            {done ? step.description : 'Not started yet'}
                        </TimelineContent>
                    </TimelineItem>
                )
            })}
        </Timeline>
    )
}

interface ReportDrawerProps {
    report: Report | null
    attachments: Attachment[]
    loading: boolean
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    getImageUrl: (path: string) => string
    onUpdateStatus: (reportId: string, newStatus: number, teamLeaderId?: string | null, isResolvedVal?: boolean | null) => Promise<void>
    onUpdatePriority: (reportId: string, newPriority: number) => Promise<void>
}

export function ReportDrawer({
    report,
    attachments,
    loading,
    isOpen,
    onOpenChange,
    getImageUrl,
    onUpdateStatus,
    onUpdatePriority,
}: ReportDrawerProps) {
    const [editedStatus, setEditedStatus] = useState<string | null>(null)
    const [editedPriority, setEditedPriority] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [isSavingPriority, setIsSavingPriority] = useState(false)
    const [isSavingResolution, setIsSavingResolution] = useState(false)

    const handleAcceptWork = async () => {
        if (!report) return
        setIsSavingResolution(true)
        try {
            await onUpdateStatus(report.id, 4, null, false)
        } catch (err) {
            console.error('Failed to accept work:', err)
        } finally {
            setIsSavingResolution(false)
        }
    }

    const handleRejectWork = async () => {
        if (!report) return
        setIsSavingResolution(true)
        try {
            await onUpdateStatus(report.id, 2, report.team_leader, false)
        } catch (err) {
            console.error('Failed to reject work:', err)
        } finally {
            setIsSavingResolution(false)
        }
    }

    const [leaders, setLeaders] = useState<any[]>([])
    const [isLeaderDialogOpen, setIsLeaderDialogOpen] = useState(false)

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const data = await getModerators()
                setLeaders(data || [])
            } catch (err) {
                console.error('Failed to fetch team leaders:', err)
            }
        }
        fetchLeaders()
    }, [])

    useEffect(() => {
        if (isOpen) {
            setEditedStatus(null)
            setEditedPriority(null)
            setIsSaving(false)
            setIsSavingPriority(false)
            setIsLeaderDialogOpen(false)
        }
    }, [isOpen, report?.id])

    const handleAssignLeader = async (leaderId: string) => {
        if (!report) return
        try {
            await onUpdateStatus(report.id, 2, leaderId)
            setIsLeaderDialogOpen(false)
            setEditedStatus(null)
        } catch (err) {
            console.error('Failed to assign leader:', err)
        }
    }

    const renderLocation = (loc: string) => {
        if (!loc) return null
        try {
            const parsed = JSON.parse(loc)
            if (parsed && typeof parsed === 'object' && 'latitude' in parsed && 'longitude' in parsed) {
                const lat = parseFloat(parsed.latitude)
                const lon = parseFloat(parsed.longitude)

                return (
                    <div className="w-full h-48 sm:h-64 rounded-md overflow-hidden border mt-2 z-0 relative">
                        <DynamicMap lat={lat} lon={lon} />
                    </div>
                )
            }
        } catch {
            // Not JSON
        }
        return <p className="text-foreground bg-muted/50 p-3 rounded-md">{loc}</p>
    }

    const currentStatusStr = report ? report.status.toString() : ''
    const displayStatus = editedStatus !== null ? editedStatus : currentStatusStr

    const currentPriorityStr = report ? (report.priority ?? 0).toString() : ''
    const displayPriority = editedPriority !== null ? editedPriority : currentPriorityStr

    const handleSaveStatus = async () => {
        if (!report || editedStatus === null) return
        setIsSaving(true)
        try {
            await onUpdateStatus(report.id, parseInt(editedStatus))
            setEditedStatus(null)
        } finally {
            setIsSaving(false)
        }
    }

    const handleSavePriority = async () => {
        if (!report || editedPriority === null) return
        setIsSavingPriority(true)
        try {
            await onUpdatePriority(report.id, parseInt(editedPriority))
            setEditedPriority(null)
        } finally {
            setIsSavingPriority(false)
        }
    }

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent className="!w-[40vw] border-primary/30 !max-w-none sm:max-w-[60vh] md:max-w-4xl overflow-y-auto p-6 sm:p-10 bg-white/60 backdrop-blur rounded-l-4xl">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-2xl">{report?.title}</SheetTitle>
                        <SheetDescription>
                            Reported on {report ? new Date(report.created_at).toLocaleString() : ''}
                        </SheetDescription>
                    </SheetHeader>

                    {report && (
                        <div className="space-y-6">
                            {report.is_resolved && (
                                <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/20 rounded-lg p-4 flex flex-col gap-3 relative overflow-hidden">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                                            <CheckCircle2 className="h-5 w-5 animate-pulse" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">Resolution Pending Approval</h4>
                                            <p className="text-xs text-emerald-700/90 dark:text-emerald-400/90 mt-0.5">
                                                The team leader has marked this issue as resolved. Please review their work and decide whether to accept or reject the resolution.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-end">
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={handleRejectWork}
                                            disabled={isSavingResolution}
                                            className="h-8 text-xs font-semibold px-4 border border-red-500/30"
                                        >
                                            Reject Work
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleAcceptWork}
                                            disabled={isSavingResolution}
                                            className="h-8 text-xs font-semibold px-4 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600"
                                        >
                                            Accept Work
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-muted/30 p-4 rounded-lg border">
                                <div className="flex items-start gap-3">
                                    <span className="text-sm font-medium text-muted-foreground w-16 mt-1.5">Status:</span>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <Select value={displayStatus} onValueChange={(val) => {
                                                if (val === '2') {
                                                    setIsLeaderDialogOpen(true)
                                                } else {
                                                    setEditedStatus(val)
                                                }
                                            }}>
                                                <SelectTrigger className="min-w-[140px] h-8 w-fit">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">New</SelectItem>
                                                    <SelectItem value="1">Under Investigation</SelectItem>
                                                    <SelectItem value="2">Assign a leader</SelectItem>
                                                    <SelectItem value="3" disabled>Work in Progress</SelectItem>
                                                    <SelectItem value="4" disabled>Resolved</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {editedStatus !== null && editedStatus !== currentStatusStr && (
                                                <Button
                                                    size="sm"
                                                    onClick={handleSaveStatus}
                                                    disabled={isSaving}
                                                    className="h-8"
                                                >
                                                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                                                    Save
                                                </Button>
                                            )}
                                        </div>
                                        {report?.team_leader && (
                                            <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                                                <span>Assigned to: <span className="font-semibold text-foreground">{leaders.find(l => l.id === report.team_leader)?.user_metadata?.name || 'Unknown Leader'}</span></span>
                                                {parseInt(displayStatus) == 2 &&
                                                    <Button variant="link" className="h-auto p-0 text-xs text-primary" onClick={() => setIsLeaderDialogOpen(true)}>
                                                        (Change)
                                                    </Button>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-muted-foreground w-16 sm:w-auto">Priority:</span>
                                    <div className="flex items-center gap-2">
                                        <Select value={displayPriority} onValueChange={setEditedPriority}>
                                            <SelectTrigger className="min-w-[120px] h-8 w-fit">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">Low</SelectItem>
                                                <SelectItem value="1">Medium</SelectItem>
                                                <SelectItem value="2">High</SelectItem>
                                                <SelectItem value="3">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {editedPriority !== null && editedPriority !== currentPriorityStr && (
                                            <Button
                                                size="sm"
                                                onClick={handleSavePriority}
                                                disabled={isSavingPriority}
                                                className="h-8"
                                            >
                                                {isSavingPriority ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                                                Save
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                                {renderLocation(report.location)}
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                                <div className="text-foreground bg-muted/50 p-3 rounded-md whitespace-pre-wrap min-h-24">
                                    {report.description || <span className="text-muted-foreground italic">No description provided.</span>}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-3">Progress Timeline</h4>
                                <ReportTimeline report={report} />
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-3">Attachments</h4>
                                {loading ? (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading attachments...
                                    </div>
                                ) : attachments.length === 0 ? (
                                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border border-dashed">
                                        No attachments for this report.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {attachments.map((file) => {
                                            const isImage = file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                            const isVideo = file.name.match(/\.(mp4|webm|ogg)$/i);
                                            const url = getImageUrl(file.file_url);

                                            return (
                                                <div key={file.id} className="relative aspect-square rounded-md overflow-hidden border bg-muted/30 flex items-center justify-center group">
                                                    {isImage ? (
                                                        <img src={url} alt={file.name} className="object-cover w-full h-full" />
                                                    ) : isVideo ? (
                                                        <video src={url} controls className="object-cover w-full h-full" />
                                                    ) : (
                                                        <div className="p-4 text-center break-all">
                                                            <p className="text-xs">{file.name}</p>
                                                        </div>
                                                    )}
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium"
                                                    >
                                                        Open
                                                    </a>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <Dialog open={isLeaderDialogOpen} onOpenChange={setIsLeaderDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white border border-neutral-200 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-neutral-800">Assign Team Leader</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Select a team leader to take charge of this report.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[300px] overflow-y-auto py-2 space-y-2">
                        {leaders.length === 0 ? (
                            <p className="text-sm text-center text-muted-foreground py-4">No team leaders available.</p>
                        ) : (
                            leaders.map((leader) => (
                                <div
                                    key={leader.id}
                                    onClick={() => handleAssignLeader(leader.id)}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-neutral-50 cursor-pointer transition-colors duration-150 group"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm text-neutral-800 group-hover:text-primary transition-colors">
                                            {leader.user_metadata?.name || 'Unknown'}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{leader.email}</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground bg-muted group-hover:bg-primary group-hover:text-white px-2.5 py-1 rounded-full font-medium transition-colors">
                                        Select
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
