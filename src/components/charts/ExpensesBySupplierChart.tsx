import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig } from '@/components/ui/chart'

type ChartData = {
  fornecedor: string
  total: number
}[]

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export const ExpensesBySupplierChart = ({ data }: { data: ChartData }) => {
  const chartConfig = data.reduce((acc, item, index) => {
    acc[item.fornecedor] = {
      label: item.fornecedor,
      color: COLORS[index % COLORS.length],
    }
    return acc
  }, {} as ChartConfig)

  return (
    <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
      <CardHeader>
        <CardTitle>Despesas por Fornecedor</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <ResponsiveContainer>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => [
                      (value as number).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }),
                      name,
                    ]}
                  />
                }
              />
              <Pie
                data={data}
                dataKey="total"
                nameKey="fornecedor"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="fornecedor" />}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
