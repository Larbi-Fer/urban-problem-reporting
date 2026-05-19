import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Loader2, AlertCircle } from 'lucide-react'
import { Report, statusMap, priorityMap } from './types'
import { cn } from '@/lib/utils'

interface ReportsTableProps {
    reports: Report[]
    loading: boolean
    error: string | null
    onRowClick: (report: Report) => void
    selectedId?: string
}

export function ReportsTable({ reports, loading, error, onRowClick, selectedId }: ReportsTableProps) {
    const formatLocation = (loc: string) => {
        if (!loc) return ''
        try {
            const parsed = JSON.parse(loc)
            if (parsed && typeof parsed === 'object' && 'latitude' in parsed && 'longitude' in parsed) {
                return 'On the map'
            }
        } catch {
            // Not JSON
        }
        return loc
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10 text-muted-foreground border rounded-md bg-card">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 p-10 text-destructive justify-center border rounded-md bg-card">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
            </div>
        )
    }

    if (reports.length === 0) {
        return (
            <div className="p-10 text-center text-muted-foreground border rounded-md bg-card">
                No reports found.
            </div>
        )
    }

    return (
        <div className="rounded-md border bg-card bg-linear-to-br from-[#ccc2] via-white to-[#ccc2]">
            <Table className='overflow-hidden'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(() => {
                        const sortedReports = [...reports].sort((a, b) => {
                            const aResolved = !!a.is_resolved;
                            const bResolved = !!b.is_resolved;
                            if (aResolved && !bResolved) return -1;
                            if (!aResolved && bResolved) return 1;
                            return 0;
                        });

                        return sortedReports.map((report, i) => {
                            const isResolved = !!report.is_resolved;
                            const nextReport = sortedReports[i + 1];
                            const showSeparator = isResolved && nextReport && !nextReport.is_resolved;

                            return (
                                <TableRow
                                    key={report.id}
                                    className={cn(
                                        "cursor-pointer hover:bg-muted/50 rise",
                                        selectedId === report.id && "bg-[linear-gradient(to_right,#eee8_0%,#eee2_16%,#eee8_33%,#eee2_50%,#eee8_66%,#eee2_83%,#eee8_100%)] border-neutral-600/50 border-y-2",
                                        showSeparator && "border-b-2 border-primary"
                                    )}
                                    style={{
                                        '--delay': `${i * 50}ms`
                                    } as React.CSSProperties}
                                    onClick={() => onRowClick(report)}
                                >
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {report.title}
                                            {isResolved && (
                                                <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600 hover:bg-green-500/20 py-0 h-4 border-green-500/20">
                                                    Resolved by Leader
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatLocation(report.location)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={statusMap[report.status || 0]?.color}>
                                            {statusMap[report.status || 0]?.label || 'Unknown'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={priorityMap[report.priority || 0]?.color}>
                                            {priorityMap[report.priority || 0]?.label || 'Unknown'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {new Date(report.created_at).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            );
                        });
                    })()}
                </TableBody>
            </Table>
        </div>
    )
}
