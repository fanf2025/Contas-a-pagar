import { Lancamento } from '@/types'
import { toast } from 'sonner'

const convertToCSV = (data: Lancamento[]): string => {
  if (data.length === 0) return ''

  const headers = [
    'id',
    'data',
    'mes',
    'ano',
    'tipo',
    'categoria',
    'descricao',
    'fornecedor',
    'valor',
    'valorPago',
    'tipoPagamento',
    'dataPagamento',
  ]
  const csvRows = [headers.join(';')]

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header as keyof Lancamento]
      const stringValue = value === null ? '' : String(value)
      const escaped = stringValue.replace(/"/g, '""')
      return `"${escaped}"`
    })
    csvRows.push(values.join(';'))
  }

  return csvRows.join('\n')
}

export const useExcelExport = () => {
  const exportToExcel = (data: Lancamento[], filename: string) => {
    try {
      if (data.length === 0) {
        toast.info('Nenhum dado para exportar.')
        return
      }
      const csvString = convertToCSV(data)
      const blob = new Blob(['\uFEFF' + csvString], {
        type: 'text/csv;charset=utf-8;',
      })
      const link = document.createElement('a')

      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Exportação concluída!', {
        description: `${filename} foi baixado com sucesso.`,
      })
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      toast.error('Falha na exportação', {
        description: 'Ocorreu um erro ao tentar exportar os dados.',
      })
    }
  }

  return { exportToExcel }
}
