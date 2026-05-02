import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface DashboardFiltersProps {
    statusFilter: string
    setStatusFilter: (val: string) => void
    priorityFilter: string
    setPriorityFilter: (val: string) => void
}

export function DashboardFilters({
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
}: DashboardFiltersProps) {
    return (
        <div className="flex flex-wrap gap-4">
            <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="0">Open</SelectItem>
                        <SelectItem value="1">In Progress</SelectItem>
                        <SelectItem value="2">Resolved</SelectItem>
                        <SelectItem value="3">Closed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-40">
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="0">Low</SelectItem>
                        <SelectItem value="1">Medium</SelectItem>
                        <SelectItem value="2">High</SelectItem>
                        <SelectItem value="3">Critical</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
