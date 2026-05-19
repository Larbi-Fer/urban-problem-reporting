'use client'

import { useMemo } from 'react'
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from 'recharts'

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

const chartConfig = {
  count: {
    label: 'Reports',
  },
  new: {
    label: 'New',
    color: 'var(--chart-1)',
  },
  investigation: {
    label: 'Under Investigation',
    color: 'var(--chart-2)',
  },
  assigned: {
    label: 'Assigned',
    color: 'var(--chart-3)',
  },
  wip: {
    label: 'Work In Progress',
    color: 'var(--chart-4)',
  },
  resolved: {
    label: 'Resolved',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export function StatusDistributionChart({ reports }: { reports: Report[] }) {
  const chartData = useMemo(() => {
    return [
      { status: 'New', count: reports.filter(r => r.status === 0).length, fill: 'var(--color-new)' },
      { status: 'Under Investigation', count: reports.filter(r => r.status === 1).length, fill: 'var(--color-investigation)' },
      { status: 'Assigned', count: reports.filter(r => r.status === 2).length, fill: 'var(--color-assigned)' },
      { status: 'Work In Progress', count: reports.filter(r => r.status === 3).length, fill: 'var(--color-wip)' },
      { status: 'Resolved', count: reports.filter(r => r.status === 4).length, fill: 'var(--color-resolved)' },
    ].filter(item => item.count > 0)
  }, [reports])

  const totalReports = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [chartData])

  const dataWithPercentage = useMemo(() => {
    return chartData.map(item => ({
      ...item,
      percentage: totalReports > 0 ? ((item.count / totalReports) * 100).toFixed(1) : '0.0'
    }))
  }, [chartData, totalReports])

  return (
    <Card className="flex flex-col rounded-2xl shadow-sm h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Status Distribution</CardTitle>
        <CardDescription>All time reports distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] w-full mt-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={dataWithPercentage}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                strokeWidth={2}
              >
                {dataWithPercentage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value, entry: any) => {
                  const item = dataWithPercentage.find(d => d.status === value);
                  return <span className="text-sm font-medium text-muted-foreground">{value} ({item?.percentage}%)</span>
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
