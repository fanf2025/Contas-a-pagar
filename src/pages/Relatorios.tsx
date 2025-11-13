import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon, File, FileSpreadsheet } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { format, parseISO } from 'date-fns'
import { useAppStore } from '@/data/store'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { RelatorioTable } from '@/components/RelatorioTable'
import { MultiSelectCombobox } from '@/components/ui/combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useExcelExport } from '@/hooks/useExcelExport'

type ReportItem = {
  id: string
  date: string
  description: string
  category: string
  type: 'Receita' | 'Despesa'
  value: number
}

const RelatoriosPage = () => {
  const [date, setDate] = useState<DateRange | undefined>()
  const [reportData, setReportData] = useState<ReportItem[] | null>(null)
  const [typeFilter, setTypeFilter] = useState<'all' | 'Receita' | 'Despesa'>(
    'all',
  )
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])

  const { lancamentos, cashEntries, categorias, cashCategories } = useAppStore()
  const { exportToExcel } = useExcelExport()

  const categoryOptions = useMemo(() => {
    const despesaOptions = categorias.map((c) => ({
      value: c.id,
      label: `[D] ${c.nome}`,
    }))
    const receitaOptions = cashCategories.map((c) => ({
      value: c.id,
      label: `[R] ${c.nome}`,
    }))
    return [...despesaOptions, ...receitaOptions]
  }, [categorias, cashCategories])

  const handleGenerateReport = () => {
    if (!date?.from || !date?.to) {
      toast.warning('Período inválido', {
        description: 'Por favor, selecione uma data de início e fim.',
      })
      return
    }

    const despesas = lancamentos
      .filter((l) => {
        const vencimentoDate = parseISO(l.dataVencimento)
        const matchesDate =
          vencimentoDate >= date.from! && vencimentoDate <= date.to!
        const matchesCategory =
          categoryFilter.length === 0 ||
          categoryFilter.includes(
            categorias.find((c) => c.nome === l.categoria)?.id || '',
          )
        return matchesDate && matchesCategory
      })
      .map(
        (l): ReportItem => ({
          id: `d-${l.id}`,
          date: l.dataVencimento,
          description: l.descricao,
          category: l.categoria,
          type: 'Despesa',
          value: l.valor,
        }),
      )

    const receitas = cashEntries
      .filter((e) => {
        const entryDate = parseISO(e.date)
        const matchesDate = entryDate >= date.from! && entryDate <= date.to!
        const matchesCategory =
          categoryFilter.length === 0 || categoryFilter.includes(e.categoryId)
        return matchesDate && matchesCategory
      })
      .map(
        (e): ReportItem => ({
          id: `r-${e.id}`,
          date: e.date,
          description: e.origin,
          category:
            cashCategories.find((c) => c.id === e.categoryId)?.nome || 'N/A',
          type: 'Receita',
          value: e.value,
        }),
      )

    let combinedData = [...despesas, ...receitas]

    if (typeFilter !== 'all') {
      combinedData = combinedData.filter((item) => item.type === typeFilter)
    }

    setReportData(combinedData.sort((a, b) => (a.date > b.date ? 1 : -1)))
  }

  const handleExportExcel = () => {
    if (!reportData || reportData.length === 0) {
      toast.info('Nenhum dado para exportar', {
        description: 'Gere um relatório com dados antes de exportar.',
      })
      return
    }
    const filename = `relatorio_financeiro_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
    exportToExcel(reportData, filename)
  }

  const handleExportPdf = () => {
    toast.info('Função em desenvolvimento', {
      description: 'A exportação para PDF estará disponível em breve.',
    })
  }

  return (
    <div className="page-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Relatórios Personalizados</h2>
      </div>
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'dd/MM/y')} -{' '}
                      {format(date.to, 'dd/MM/y')}
                    </>
                  ) : (
                    format(date.from, 'dd/MM/y')
                  )
                ) : (
                  <span>Selecione o período</span>
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
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Transação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="Receita">Receitas</SelectItem>
              <SelectItem value="Despesa">Despesas</SelectItem>
            </SelectContent>
          </Select>
          <div className="lg:col-span-2">
            <MultiSelectCombobox
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              placeholder="Filtrar categorias..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={handleGenerateReport}>Gerar Relatório</Button>
        </div>
      </Card>

      {reportData !== null && (
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleExportPdf}>
            <File className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
        </div>
      )}

      {reportData !== null ? (
        <RelatorioTable data={reportData} />
      ) : (
        <div className="mt-6 min-h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg p-4">
          <p className="text-muted-foreground text-center">
            Selecione os filtros e clique em "Gerar Relatório" para visualizar
            os dados.
          </p>
        </div>
      )}
    </div>
  )
}

export default RelatoriosPage
