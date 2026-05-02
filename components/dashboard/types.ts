export type Report = {
    id: string
    title: string
    description: string
    location: string
    status: number
    priority: number
    created_at: string
}

export type Attachment = {
    id: string
    name: string
    file_url: string
}

export const statusMap: Record<number, { label: string; color: string }> = {
    0: { label: 'Open', color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
    1: { label: 'In Progress', color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' },
    2: { label: 'Resolved', color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
    3: { label: 'Closed', color: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20' },
}

export const priorityMap: Record<number, { label: string; color: string }> = {
    0: { label: 'Low', color: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20' },
    1: { label: 'Medium', color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
    2: { label: 'High', color: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' },
    3: { label: 'Critical', color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20' },
}
