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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, Save } from 'lucide-react'
import { Report, Attachment, statusMap, priorityMap } from './types'

interface ReportDrawerProps {
    report: Report | null
    attachments: Attachment[]
    loading: boolean
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    getImageUrl: (path: string) => string
    onUpdateStatus: (reportId: string, newStatus: number) => Promise<void>
}

export function ReportDrawer({
    report,
    attachments,
    loading,
    isOpen,
    onOpenChange,
    getImageUrl,
    onUpdateStatus,
}: ReportDrawerProps) {
    const [editedStatus, setEditedStatus] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setEditedStatus(null)
            setIsSaving(false)
        }
    }, [isOpen, report?.id])

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

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="!w-[40vw] !max-w-none sm:max-w-[60vh] md:max-w-4xl overflow-y-auto p-6 sm:p-10">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl">{report?.title}</SheetTitle>
                    <SheetDescription>
                        Reported on {report ? new Date(report.created_at).toLocaleString() : ''}
                    </SheetDescription>
                </SheetHeader>

                {report && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-muted/30 p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground w-16">Status:</span>
                                <div className="flex items-center gap-2">
                                    <Select value={displayStatus} onValueChange={setEditedStatus}>
                                        <SelectTrigger className="w-[140px] h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Open</SelectItem>
                                            <SelectItem value="1">In Progress</SelectItem>
                                            <SelectItem value="2">Resolved</SelectItem>
                                            <SelectItem value="3">Closed</SelectItem>
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
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground w-16 sm:w-auto">Priority:</span>
                                <Badge variant="outline" className={priorityMap[report.priority || 0]?.color}>
                                    {priorityMap[report.priority || 0]?.label || 'Unknown'}
                                </Badge>
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
    )
}
