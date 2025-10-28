import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Lancamento } from '@/types'
import { toast } from 'sonner'
import { format, isValid, parse } from 'date-fns'
import { Loader2, Upload } from 'lucide-react'

type ImportCsvDialogProps = {
  isOpen: boolean
  onClose: () => void
  onImport: (data: Omit<Lancamento, 'id'>[]) => void
}

const parseCSV = (csvText: string): Record<string, string>[] => {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim())
  const rows = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim())
    if (values.length === headers.length) {
      const row = headers.reduce(
        (acc, header, index) => {
          acc[header] = values[index]
          return acc
        },
        {} as Record<string, string>,
      )
      rows.push(row)
    }
  }
  return rows
}

const validateAndTransform = (
  parsedData: Record<string, string>[],
): Omit<Lancamento, 'id'>[] => {
  const requiredFields = [
    'data',
    'categoria',
    'descricao',
    'valor',
    'tipoPagamento',
  ]

  return parsedData.map((row, index) => {
    for (const field of requiredFields) {
      if (!row[field]) {
        throw new Error(
          `Linha ${index + 2}: Campo obrigatório "${field}" está faltando.`,
        )
      }
    }

    const date = parse(row.data, 'yyyy-MM-dd', new Date())
    if (!isValid(date)) {
      throw new Error(
        `Linha ${index + 2}: Formato de data inválido para "${row.data}". Use AAAA-MM-DD.`,
      )
    }

    const valor = parseFloat(row.valor)
    if (isNaN(valor)) {
      throw new Error(`Linha ${index + 2}: Valor inválido "${row.valor}".`)
    }

    return {
      data: row.data,
      mes: format(date, 'MMMM'),
      ano: date.getFullYear(),
      tipo: 'DESPESAS',
      categoria: row.categoria,
      descricao: row.descricao,
      fornecedor: row.fornecedor || 'N/A',
      valor,
      valorPago: 0,
      tipoPagamento: row.tipoPagamento,
      dataPagamento: null,
    }
  })
}

export const ImportCsvDialog = ({
  isOpen,
  onClose,
  onImport,
}: ImportCsvDialogProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Record<string, string>[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        toast.error('Formato de arquivo inválido', {
          description: 'Por favor, selecione um arquivo .csv',
        })
        return
      }
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const parsed = parseCSV(text)
        setPreview(parsed.slice(0, 5))
      }
      reader.readAsText(selectedFile)
    }
  }

  const handleImportClick = async () => {
    if (!file) {
      toast.warning('Nenhum arquivo selecionado', {
        description: 'Por favor, selecione um arquivo para importar.',
      })
      return
    }
    setIsLoading(true)
    try {
      const text = await file.text()
      const parsedData = parseCSV(text)
      const transformedData = validateAndTransform(parsedData)
      onImport(transformedData)
      handleClose()
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Erro na importação', { description: error.message })
      } else {
        toast.error('Erro na importação', {
          description: 'Ocorreu um erro desconhecido.',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setPreview([])
    onClose()
  }

  const headers = preview.length > 0 ? Object.keys(preview[0]) : []

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Lançamentos de CSV</DialogTitle>
          <DialogDescription>
            Selecione um arquivo CSV para importar. O arquivo deve conter as
            colunas: data (AAAA-MM-DD), categoria, descricao, valor,
            tipoPagamento, fornecedor (opcional).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csv-file">Arquivo CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
          {preview.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Pré-visualização dos dados</h4>
              <div className="rounded-md border max-h-60 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((row, index) => (
                      <TableRow key={index}>
                        {headers.map((header) => (
                          <TableCell key={header}>{row[header]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleImportClick}
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
