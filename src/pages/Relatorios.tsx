import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon, File, FileSpreadsheet } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { addDays, format } from 'date-fns'
import { useAppStore } from '@/data/store'
import { ExpensesByCategoryChart } from '@/components/charts/ExpensesByCategoryChart'
import { ExpensesBySupplierChart } from '@/components/charts/ExpensesBySupplierChart'
import { MonthlyExpenseTrendChart } from '@/components/charts/MonthlyExpenseTrendChart'
import { Card } from '@/components/ui/card'

type ReportType = 'cat' | 'for' | 'status' | 'trend'

const RelatoriosPage = () => {
  const [reportType, setReportType] = useState<ReportType | null>(null)
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const { lancamentos } = useAppStore()

  const generateReport = () => {
    if (!reportType || !date?.from || !date?.to) return null

    const filtered = lancamentos.filter((l) => {
      const lDate = new Date(l.data)
      return lDate >= date.from! && lDate <= date.to!
    })

    switch (reportType) {
      case 'cat': {
        const data = filtered.reduce(
          (acc, l) => {
            acc[l.categoria] = (acc[l.categoria] || 0) + l.valor
            return acc
          },
          {} as Record<string, number>,
        )
        const chartData = Object.entries(data).map(([categoria, total]) => ({
          categoria,
          total,
        }))
        return <ExpensesByCategoryChart data={chartData} />
      }
      case 'for': {
        const data = filtered.reduce(
          (acc, l) => {
            if (l.fornecedor !== 'N/A') {
              acc[l.fornecedor] = (acc[l.fornecedor] || 0) + l.valor
            }
            return acc
          },
          {} as Record<string, number>,
        )
        const chartData = Object.entries(data).map(([fornecedor, total]) => ({
          fornecedor,
          total,
        }))
        return <ExpensesBySupplierChart data={chartData} />
      }
      case 'trend': {
        const data = filtered.reduce(
          (acc, l) => {
            const month = format(new Date(l.data), 'MMM/yy')
            acc[month] = (acc[month] || 0) + l.valor
            return acc
          },
          {} as Record<string, number>,
        )
        const chartData = Object.entries(data)
          .map(([month, total]) => ({ month, total }))
          .sort(
            (a, b) =>
              new Date(
                `01/${a.month.split('/')[0]}/20${a.month.split('/')[1]}`,
              ).getTime() -
              new Date(
                `01/${b.month.split('/')[0]}/20${b.month.split('/')[1]}`,
              ).getTime(),
          )
        return <MonthlyExpenseTrendChart data={chartData} />
      }
      default:
        return (
          <p className="text-muted-foreground">
            Relatório de status ainda não implementado.
          </p>
        )
    }
  }

  return (
    <div className="page-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Relatórios Avançados</h2>
      </div>
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select onValueChange={(value: ReportType) => setReportType(value)}>
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="Selecione um modelo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cat">Despesas por Categoria</SelectItem>
              <SelectItem value="for">Despesas por Fornecedor</SelectItem>
              <SelectItem value="trend">
                Tendência Mensal de Despesas
              </SelectItem>
              <SelectItem value="status">Despesas Pagas x Em Aberto</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className="w-full md:w-[300px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd, y')} -{' '}
                      {format(date.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Escolha um período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => console.log('Exporting PDF...')}
          >
            <File className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Exporting Excel...')}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
        </div>
        <div className="mt-6 min-h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg p-4">
          {reportType ? (
            generateReport()
          ) : (
            <p className="text-muted-foreground">
              Selecione um relatório e um período para visualizar os dados.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}

export default RelatoriosPage
