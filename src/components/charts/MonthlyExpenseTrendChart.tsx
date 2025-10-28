import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { ChartConfig } from '@/components/ui/chart'

type ChartData = {
  month: string
  total: number
}[]

const chartConfig = {
  total: {
    label: 'Total Gasto',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export const MonthlyExpenseTrendChart = ({ data }: { data: ChartData }) => {
  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(value) =>
              `R$${((value as number) / 1000).toFixed(0)}k`
            }
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  (value as number).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                }
              />
            }
          />
          <Line
            dataKey="total"
            type="monotone"
            stroke="var(--color-total)"
            strokeWidth={2}
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
