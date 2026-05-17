import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, ArrowLeft, ClipboardList, Search, Wrench, CheckCircle2 } from 'lucide-react'
import { Report, Attachment, statusMap, priorityMap } from '../dashboard/types'
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
            icon: <ClipboardList className="h-2 w-2" />,
        },
        {
            label: 'Under Investigation',
            description: 'Authorities are reviewing the report.',
            date: report.under_investigation_at,
            icon: <Search className="h-2 w-2" />,
        },
        {
            label: 'Work in Progress',
            description: 'Active work has started on the issue.',
            date: report.work_in_progress_at,
            icon: <Wrench className="h-2 w-2" />,
        },
        {
            label: 'Resolved',
            description: 'The issue has been fully resolved.',
            date: report.resolved_at,
            icon: <CheckCircle2 className="h-2 w-2" />,
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
                            <span className={done ? 'text-primary-foreground' : 'text-muted-foreground/40'}>
                                {step.icon}
                            </span>
                        </TimelineIndicator>
                        <TimelineHeader>
                            <TimelineTitle className={`text-xs ${done ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                                {step.label}
                            </TimelineTitle>
                            {done && (
                                <TimelineDate className="text-[10px]">
                                    {new Date(step.date!).toLocaleString()}
                                </TimelineDate>
                            )}
                        </TimelineHeader>
                        <TimelineContent className={`text-[10px] ${done ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                            {done ? step.description : 'Not started yet'}
                        </TimelineContent>
                    </TimelineItem>
                )
            })}
        </Timeline>
    )
}

interface ReportDetailsProps {
    report: Report | null
    attachments: Attachment[]
    loading: boolean
    getImageUrl: (path: string) => string
    onUpdateStatus: (reportId: string, newStatus: number) => Promise<void>
    onBack?: () => void
}

export function ReportDetails({
    report,
    attachments,
    loading,
    getImageUrl,
    onUpdateStatus,
    onBack
}: ReportDetailsProps) {
    const [editedStatus, setEditedStatus] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        setEditedStatus(null)
        setIsSaving(false)
    }, [report?.id])

    const currentStatusStr = report ? report.status.toString() : ''
    const displayStatus = editedStatus !== null ? editedStatus : currentStatusStr

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

    if (!report) return null

    return (
        <div className="flex flex-col h-full bg-neutral-200/60">
            <div className="p-4 border-b flex items-center gap-2 shrink-0">
                {onBack && (
                    <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                )}
                <h2 className="text-lg font-bold line-clamp-1 flex-1">{report.title}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Reported on {new Date(report.created_at).toLocaleString()}
                    </p>
                </div>

                <div className="flex flex-col gap-4 bg-muted/80 p-3 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Status</span>
                        <div className="flex items-center gap-2">
                            <Select value={displayStatus} onValueChange={setEditedStatus}>
                                <SelectTrigger className="min-w-[120px] h-7 text-xs w-fit">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Open</SelectItem>
                                    <SelectItem value="1">Under Investigation</SelectItem>
                                    <SelectItem value="2">Work in Progress</SelectItem>
                                    <SelectItem value="3">Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                            {editedStatus !== null && editedStatus !== currentStatusStr && (
                                <Button
                                    size="sm"
                                    onClick={handleSaveStatus}
                                    disabled={isSaving}
                                    className="h-7 px-2 text-[10px]"
                                >
                                    {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
                                    Save
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Priority</span>
                        <Badge variant="outline" className={`text-[10px] h-5 ${priorityMap[report.priority || 0]?.color}`}>
                            {priorityMap[report.priority || 0]?.label || 'Unknown'}
                        </Badge>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Description</h4>
                    <div className="text-sm text-foreground bg-muted/80 p-3 rounded-md whitespace-pre-wrap">
                        {report.description || <span className="text-muted-foreground italic">No description provided.</span>}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Progress Timeline</h4>
                    <ReportTimeline report={report} />
                </div>

                <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Attachments</h4>
                    {loading ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Loading attachments...
                        </div>
                    ) : attachments.length === 0 ? (
                        <p className="text-xs text-muted-foreground bg-muted/80 p-3 rounded-md border border-dashed">
                            No attachments for this report.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {attachments.map((file) => {
                                const isImage = file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                const isVideo = file.name.match(/\.(mp4|webm|ogg)$/i);
                                const url = getImageUrl(file.file_url);

                                return (
                                    <div key={file.id} className="relative aspect-square rounded-md overflow-hidden border bg-muted/30 flex items-center justify-center group">
                                        {isImage ? (
                                            <img src={url} alt={file.name} className="object-cover w-full h-full" />
                                        ) : isVideo ? (
                                            <video src={url} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="p-2 text-center break-all">
                                                <p className="text-[10px]">{file.name}</p>
                                            </div>
                                        )}
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium"
                                        >
                                            View
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
