import { useTranslation } from 'react-i18next'
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getDayLabel } from '../chartLabels'

export function AnalyticsChart({
  data,
}: {
  data: {
    day: number
    total_plays: number
    unique_viewers: number
  }[]
}) {
  const { t, i18n } = useTranslation()
  const translatedData = data.map((d) => ({
    name: getDayLabel(d.day, i18n.resolvedLanguage),
    total_plays: d.total_plays,
    unique_viewers: d.unique_viewers,
  }))

  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={translatedData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ stroke: 'hsl(var(--border))' }}
          contentStyle={{
            backgroundColor: 'var(--color-popover)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-popover-foreground)',
          }}
          itemStyle={{
            color: 'var(--color-popover-foreground)',
          }}
          labelStyle={{
            color: 'var(--color-popover-foreground)',
          }}
        />
        <Legend
          iconType='circle'
          formatter={(value: string) => t(`dashboard.${value}`)}
        />
        <Area
          type='monotone'
          dataKey='total_plays'
          stroke='currentColor'
          className='text-primary'
          fill='currentColor'
          fillOpacity={0.15}
        />
        <Area
          type='monotone'
          dataKey='unique_viewers'
          stroke='currentColor'
          className='text-muted-foreground'
          fill='currentColor'
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
