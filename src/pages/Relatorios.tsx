import { useState } from 'react'
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
import { Lancamento } from '@/types'
import { RelatorioLancamentosTable } from '@/components/RelatorioLancamentosTable'
import { useExcelExport } from '@/hooks/useExcelExport'
import { toast } from 'sonner'

const RelatoriosPage = () => {
  const [date, setDate] = useState<DateRange | undefined>()
  const [reportData, setReportData] = useState<Lancamento[] | null>(null)
  const { lancamentos } = useAppStore()
  const { exportToExcel } = useExcelExport()

  const handleGenerateReport = () => {
    if (!date?.from || !date?.to) {
      toast.warning('Período inválido', {
        description: 'Por favor, selecione uma data de início e fim.',
      })
      return
    }

    const filtered = lancamentos.filter((l) => {
      const vencimentoDate = parseISO(l.dataVencimento)
      return vencimentoDate >= date.from! && vencimentoDate <= date.to!
    })

    setReportData(filtered)
  }

  const handleExportExcel = () => {
    if (!reportData || reportData.length === 0) {
      toast.info('Nenhum dado para exportar', {
        description: 'Gere um relatório com dados antes de exportar.',
      })
      return
    }
    const filename = `relatorio_lancamentos_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
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
        <h2 className="text-2xl font-bold">Relatórios de Lançamentos</h2>
      </div>
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
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
          <Button onClick={handleGenerateReport}>Gerar Relatório</Button>
        </div>

        {reportData !== null && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleExportPdf}>
              <File className="mr-2 h-4 w-4" /> Exportar PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar Excel
            </Button>
          </div>
        )}
      </Card>

      {reportData !== null ? (
        <RelatorioLancamentosTable lancamentos={reportData} />
      ) : (
        <div className="mt-6 min-h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg p-4">
          <p className="text-muted-foreground text-center">
            Selecione um período e clique em "Gerar Relatório" para visualizar
            os lançamentos.
          </p>
        </div>
      )}
    </div>
  )
}

export default RelatoriosPage
