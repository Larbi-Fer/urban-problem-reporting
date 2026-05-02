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

interface ReportsTableProps {
    reports: Report[]
    loading: boolean
    error: string | null
    onRowClick: (report: Report) => void
}

export function ReportsTable({ reports, loading, error, onRowClick }: ReportsTableProps) {
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
        <div className="rounded-md border bg-card">
            <Table>
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
                    {reports.map((report) => (
                        <TableRow
                            key={report.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => onRowClick(report)}
                        >
                            <TableCell className="font-medium">{report.title}</TableCell>
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
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
