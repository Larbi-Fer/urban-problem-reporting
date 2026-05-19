'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { Report } from '@/components/dashboard/types'
import { useMemo } from 'react'

const chartConfig = {
  newTasks: {
    label: 'New Tasks',
    color: 'var(--chart-1)',
  },
  resolvedTasks: {
    label: 'Resolved Tasks',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function TasksEvolutionChart({ reports }: { reports: Report[] }) {
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentYear = new Date().getFullYear().toString()
    
    return months.map((month, index) => {
      const newTasks = reports.filter(r => {
        const d = new Date(r.created_at)
        return d.getFullYear().toString() === currentYear && d.getMonth() === index
      }).length

      const resolvedTasks = reports.filter(r => {
        if (!r.resolved_at) return false
        const d = new Date(r.resolved_at)
        return d.getFullYear().toString() === currentYear && d.getMonth() === index
      }).length

      return { month, newTasks, resolvedTasks }
    })
  }, [reports])

  return (
    <Card className="flex flex-col rounded-2xl shadow-sm h-full">
      <CardHeader>
        <CardTitle>Tasks Evolution</CardTitle>
        <CardDescription>Comparison of new vs resolved tasks over time</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-newTasks)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-newTasks)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-resolvedTasks)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-resolvedTasks)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={10} 
                className="text-xs text-muted-foreground" 
              />
              <ChartTooltip
                cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '4 4' }}
                content={<ChartTooltipContent />}
              />
              <Area
                type="monotone"
                dataKey="resolvedTasks"
                stroke="var(--color-resolvedTasks)"
                fillOpacity={1}
                fill="url(#fillResolved)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="newTasks"
                stroke="var(--color-newTasks)"
                fillOpacity={1}
                fill="url(#fillNew)"
                strokeWidth={2}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
