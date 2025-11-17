import { toast } from 'sonner'

// A simple CSV stringifier
const toCsv = (data: any[], headers: string[]): string => {
  const csvRows = []
  csvRows.push(headers.join(','))

  for (const row of data) {
    const values = headers.map((header) => {
      const value =
        row[header] === null || row[header] === undefined ? '' : row[header]
      const escaped = ('' + value).replace(/"/g, '\\"')
      return `"${escaped}"`
    })
    csvRows.push(values.join(','))
  }
  return csvRows.join('\n')
}

export const useExcelExport = () => {
  const exportToExcel = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error('Nenhum dado para exportar.')
      return
    }

    try {
      const headers = Object.keys(data[0])
      const csvContent = toCsv(data, headers)

      const blob = new Blob([`\uFEFF${csvContent}`], {
        type: 'text/csv;charset=utf-8;',
      })
      const link = document.createElement('a')
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute(
          'download',
          filename.endsWith('.csv') ? filename : `${filename}.csv`,
        )
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Exportação concluída!', {
          description: `O arquivo ${filename} foi baixado.`,
        })
      }
    } catch (error) {
      toast.error('Falha na exportação', {
        description: 'Não foi possível gerar o arquivo de exportação.',
      })
      console.error('Export error:', error)
    }
  }

  return { exportToExcel }
}
