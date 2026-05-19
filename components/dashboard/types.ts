export type Report = {
    id: string
    title: string
    description: string
    location: string
    status: number
    priority: number
    created_at: string
    under_investigation_at: string | null
    work_in_progress_at: string | null
    resolved_at: string | null
    assigned_to_at: string | null
    team_leader: string | null
    is_resolved: boolean | null
}

export type Attachment = {
    id: string
    name: string
    file_url: string
}

export const statusMap: Record<number, { label: string; color: string }> = {
    0: { label: 'New', color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
    1: { label: 'Under Investigation', color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' },
    2: { label: 'Under the leader', color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20' },
    3: { label: 'Work in Progress', color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
    4: { label: 'Resolved', color: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20' },
}

export const priorityMap: Record<number, { label: string; color: string }> = {
    0: { label: 'Low', color: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20' },
    1: { label: 'Medium', color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
    2: { label: 'High', color: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' },
    3: { label: 'Critical', color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20' },
}
