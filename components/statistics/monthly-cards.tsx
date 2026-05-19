'use client'

import { Report } from '@/components/dashboard/types'
import {
    FileText,
    CheckCircle2,
    BarChart3,
    ArrowUp,
    ArrowDown,
    Minus,
    WrenchIcon
} from 'lucide-react'

interface MonthlyCardProps {
    label: string
    currentMonthCount: number
    difference: number
    monthName: string
    icon: React.ReactNode
    colorClass: string
    bgClass: string
    borderClass: string
    index: number
}

function MonthlyCard({
    label,
    currentMonthCount,
    difference,
    monthName,
    icon,
    colorClass,
    bgClass,
    borderClass,
    index
}: MonthlyCardProps) {
    const isIncrease = difference > 0
    const isDecrease = difference < 0
    const isNeutral = difference === 0

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

            <div className="flex flex-col gap-2">
                <p className={`text-4xl font-bold tracking-tight ${colorClass}`}>
                    {currentMonthCount}
                </p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                        Total in <span className="font-medium">{monthName}</span>
                    </p>
                    <div className={`flex items-center text-xs font-medium ${isIncrease ? 'text-green-500' : isDecrease ? 'text-red-500' : 'text-gray-500'}`}>
                        {isIncrease && <ArrowUp className="w-3 h-3 mr-1" />}
                        {isDecrease && <ArrowDown className="w-3 h-3 mr-1" />}
                        {isNeutral && <Minus className="w-3 h-3 mr-1" />}
                        <span>{Math.abs(difference)} {isIncrease ? 'more' : isDecrease ? 'less' : 'same'} than last month</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface MonthlyCardsProps {
    reports: Report[]
}

export function MonthlyCards({ reports }: MonthlyCardsProps) {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Calculate previous month
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevMonth = prevMonthDate.getMonth()
    const prevYear = prevMonthDate.getFullYear()

    const monthName = now.toLocaleString('default', { month: 'long' })

    // Helper to get reports for a specific month and year
    const getReportsForMonth = (m: number, y: number, filterFn?: (r: Report) => boolean) => {
        return reports.filter((r) => {
            const d = new Date(r.created_at)
            const matchesMonthYear = d.getMonth() === m && d.getFullYear() === y
            if (filterFn) return matchesMonthYear && filterFn(r)
            return matchesMonthYear
        })
    }

    // New Reports Stats (Status 0)
    const newCurrent = getReportsForMonth(currentMonth, currentYear, (r) => r.status === 3).length
    const newPrev = getReportsForMonth(prevMonth, prevYear, (r) => r.status === 3).length
    const newDiff = newCurrent - newPrev

    // Resolved Reports Stats (Status 4)
    const resolvedCurrent = getReportsForMonth(currentMonth, currentYear, (r) => r.status === 4).length
    const resolvedPrev = getReportsForMonth(prevMonth, prevYear, (r) => r.status === 4).length
    const resolvedDiff = resolvedCurrent - resolvedPrev

    // All Reports Stats
    const allCurrent = getReportsForMonth(currentMonth, currentYear).length
    const allPrev = getReportsForMonth(prevMonth, prevYear).length
    const allDiff = allCurrent - allPrev

    const CARDS_CONFIG = [
        {
            label: 'Total Reports',
            currentCount: allCurrent,
            difference: allDiff,
            icon: <BarChart3 className="h-4 w-4" />,
            colorClass: 'text-indigo-500',
            bgClass: 'bg-indigo-500/5',
            borderClass: 'border-indigo-500/20',
        },
        {
            label: 'In Progress Reports',
            currentCount: newCurrent,
            difference: newDiff,
            icon: <WrenchIcon className="h-4 w-4" />,
            colorClass: 'text-blue-500',
            bgClass: 'bg-blue-500/5',
            borderClass: 'border-blue-500/20',
        },
        {
            label: 'Resolved Reports',
            currentCount: resolvedCurrent,
            difference: resolvedDiff,
            icon: <CheckCircle2 className="h-4 w-4" />,
            colorClass: 'text-gray-500',
            bgClass: 'bg-gray-500/5',
            borderClass: 'border-gray-500/20',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {CARDS_CONFIG.map((cfg, index) => (
                <MonthlyCard
                    key={cfg.label}
                    label={cfg.label}
                    currentMonthCount={cfg.currentCount}
                    difference={cfg.difference}
                    monthName={monthName}
                    icon={cfg.icon}
                    colorClass={cfg.colorClass}
                    bgClass={cfg.bgClass}
                    borderClass={cfg.borderClass}
                    index={index}
                />
            ))}
        </div>
    )
}
