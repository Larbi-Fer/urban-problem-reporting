'use client'

import { Report } from './types'
import {
    FileText,
    Search,
    UserCheck,
    Wrench,
    CheckCircle2,
} from 'lucide-react'

interface StatusCardProps {
    label: string
    total: number
    monthly: number
    monthName: string
    icon: React.ReactNode
    colorClass: string
    bgClass: string
    borderClass: string
    index: number
}

export function StatusCard({
    label,
    total,
    monthly,
    monthName,
    icon,
    colorClass,
    bgClass,
    borderClass,
    index
}: StatusCardProps) {
    return (
        <div
            className={`relative flex flex-col gap-3 p-5 rounded-2xl border ${borderClass} ${bgClass} overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group pan d${index}`}
        >
            {/* Decorative glow blob */}
            <div
                className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl ${colorClass} pointer-events-none`}
            />

            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground tracking-wide">
                    {label}
                </span>
                <div
                    className={`flex items-center justify-center w-9 h-9 rounded-xl ${colorClass} bg-opacity-15 border ${borderClass}`}
                >
                    <span className={colorClass}>{icon}</span>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <p className={`text-4xl font-bold tracking-tight ${colorClass}`}>
                    {total}
                </p>
                <p className="text-xs text-muted-foreground">
                    <span className={`font-semibold ${colorClass}`}>{monthly}</span>{' '}
                    in {monthName}
                </p>
            </div>
        </div>
    )
}

interface StatusCardsProps {
    reports: Report[]
}

const STATUS_CONFIG = [
    {
        status: 0,
        label: 'New',
        icon: <FileText className="h-4 w-4" />,
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-500/5',
        borderClass: 'border-blue-500/20',
    },
    {
        status: 1,
        label: 'Under Investigation',
        icon: <Search className="h-4 w-4" />,
        colorClass: 'text-yellow-500',
        bgClass: 'bg-yellow-500/5',
        borderClass: 'border-yellow-500/20',
    },
    {
        status: 2,
        label: 'Under the leader',
        icon: <UserCheck className="h-4 w-4" />,
        colorClass: 'text-purple-500',
        bgClass: 'bg-purple-500/5',
        borderClass: 'border-purple-500/20',
    },
    {
        status: 3,
        label: 'Work in Progress',
        icon: <Wrench className="h-4 w-4" />,
        colorClass: 'text-green-500',
        bgClass: 'bg-green-500/5',
        borderClass: 'border-green-500/20',
    },
    {
        status: 4,
        label: 'Resolved',
        icon: <CheckCircle2 className="h-4 w-4" />,
        colorClass: 'text-gray-500',
        bgClass: 'bg-gray-500/5',
        borderClass: 'border-gray-500/20',
    },
]

export function StatusCards({ reports }: StatusCardsProps) {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const monthName = now.toLocaleString('default', { month: 'long' })

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {STATUS_CONFIG.map((cfg) => {
                const statusReports = reports.filter((r) => r.status === cfg.status)
                const total = statusReports.length
                const monthly = statusReports.filter((r) => {
                    const d = new Date(r.created_at)
                    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
                }).length

                return (
                    <StatusCard
                        key={cfg.status}
                        label={cfg.label}
                        total={total}
                        monthly={monthly}
                        monthName={monthName}
                        icon={cfg.icon}
                        colorClass={cfg.colorClass}
                        bgClass={cfg.bgClass}
                        borderClass={cfg.borderClass}
                        index={cfg.status}
                    />
                )
            })}
        </div>
    )
}
