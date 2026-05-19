import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { Button } from '../ui/button'
import { MapIcon } from 'lucide-react'

interface DashboardFiltersProps {
    statusFilter: string
    setStatusFilter: (val: string) => void
    priorityFilter: string
    setPriorityFilter: (val: string) => void
    dateFilter: string
    setDateFilter: (val: string) => void
}

export function DashboardFilters({
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    dateFilter,
    setDateFilter,
}: DashboardFiltersProps) {
    return (
        <div className="flex flex-wrap gap-4">
            <div className="w-40 pan d1">
                <Link href='/map'>
                    <Button variant='default'>
                        <MapIcon className='h-4 w-4 mr-2' />
                        View on Map</Button>
                </Link>
            </div>
            <div className="w-40 pan d2">
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
            <div className="w-40 pan d3">
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
            <div className="w-40 pan d4">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="this_week">This week</SelectItem>
                        <SelectItem value="last_week">Last week</SelectItem>
                        <SelectItem value="this_month">This month</SelectItem>
                        <SelectItem value="last_month">Last month</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
