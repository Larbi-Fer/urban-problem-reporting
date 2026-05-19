'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Report } from '@/components/dashboard/types'
import { useMemo } from 'react'

const chartConfig = {
  count: {
    label: 'Reports',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

export function MonthlyReportsChart({ reports }: { reports: Report[] }) {
  const years = useMemo(() => {
    const y = Array.from(new Set(reports.map(r => new Date(r.created_at).getFullYear().toString())))
    return y.sort((a, b) => b.localeCompare(a))
  }, [reports])

  const defaultYear = years.length > 0 ? years[0] : new Date().getFullYear().toString()
  const [year, setYear] = useState(defaultYear)

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map((month, index) => {
      const count = reports.filter(r => {
        const d = new Date(r.created_at)
        return d.getFullYear().toString() === year && d.getMonth() === index
      }).length
      return { month, count }
    })
  }, [reports, year])

  return (
    <Card className="flex flex-col rounded-2xl shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle>Monthly Reports</CardTitle>
          <CardDescription>Number of reports created per month</CardDescription>
        </div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px] rounded-lg">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {years.length > 0 ? years.map(y => (
              <SelectItem key={y} value={y} className="rounded-lg">{y}</SelectItem>
            )) : (
              <SelectItem value={defaultYear} className="rounded-lg">{defaultYear}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 mt-4">
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                content={<ChartTooltipContent hideLabel={false} />}
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
