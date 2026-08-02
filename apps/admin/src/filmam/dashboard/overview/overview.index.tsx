import { useTranslation } from 'react-i18next'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { EmptyState } from '@/utilities/components'
import { ChartColumn } from 'lucide-react'
import { getMonthLabel } from '../chartLabels'

export function Overview({
  data,
}: {
  data: { month: number; total: number }[]
}) {
  const { t, i18n } = useTranslation()

  if (!data.length) {
    return (
      <EmptyState
        icon={ChartColumn}
        title={t('common.no_results')}
        description={t('common.no_data')}
        className='h-[350px]'
      />
    )
  }

  const translatedData = data.map((d) => ({
    name: getMonthLabel(d.month, i18n.resolvedLanguage),
    ...d,
  }))

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={translatedData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickCount={3}
          direction='ltr'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <Tooltip cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
