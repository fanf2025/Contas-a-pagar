import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Download } from 'lucide-react'
import { useAppStore } from '@/data/store'
import { Lancamento } from '@/types'
import { LancamentosTable } from '@/components/LancamentosTable'
import { ManageLancamentoDialog } from '@/components/ManageLancamentoDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useExcelExport } from '@/hooks/useExcelExport'
import { ImportCsvDialog } from '@/components/ImportCsvDialog'
import { NewEntryForm, NewEntryFormValues } from '@/components/NewEntryForm'

const LancamentosPage = () => {
  const {
    lancamentos,
    addLancamento,
    updateLancamento,
    deleteLancamento,
    addMultipleLancamentos,
  } = useAppStore()
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false)
  const [selectedLancamento, setSelectedLancamento] =
    useState<Lancamento | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [lancamentoToDeleteId, setLancamentoToDeleteId] = useState<
    string | null
  >(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const { exportToExcel } = useExcelExport()

  const handleOpenManageDialog = (lancamento: Lancamento | null = null) => {
    setSelectedLancamento(lancamento)
    setIsManageDialogOpen(true)
  }

  const handleCloseManageDialog = () => {
    setSelectedLancamento(null)
    setIsManageDialogOpen(false)
  }

  const handleAddNewLancamento = (data: NewEntryFormValues) => {
    const today = new Date()
    const lancamentoData = {
      ...data,
      data: format(today, 'yyyy-MM-dd'),
      dataVencimento: format(data.dataVencimento, 'yyyy-MM-dd'),
      mes: format(today, 'MMMM', { locale: ptBR }),
      ano: today.getFullYear(),
      tipo: 'DESPESAS' as const,
      descricao: `${data.categoria} - Doc ${data.numeroDocumento}`,
      valorPago: 0,
      dataPagamento: null,
      juros: 0,
      tipoPagamento: 'Boleto Bancário',
      fornecedor: data.fornecedor || 'N/A',
    }

    addLancamento(lancamentoData)
    toast.success('Lançamento criado com sucesso!')
  }

  const handleSaveEditedLancamento = (
    data: Omit<
      Lancamento,
      'id' | 'mes' | 'ano' | 'tipo' | 'valorPago' | 'dataPagamento' | 'juros'
    >,
  ) => {
    const date = new Date(data.data + 'T00:00:00')
    const lancamentoData = {
      ...data,
      mes: format(date, 'MMMM', { locale: ptBR }),
      ano: date.getFullYear(),
      tipo: 'DESPESAS' as const,
      valorPago: selectedLancamento?.valorPago || 0,
      dataPagamento: selectedLancamento?.dataPagamento || null,
      juros: selectedLancamento?.juros || 0,
    }

    if (selectedLancamento) {
      updateLancamento({ ...selectedLancamento, ...lancamentoData })
      toast.success('Lançamento atualizado com sucesso!')
    }
  }

  const handleDeleteRequest = (id: string) => {
    setLancamentoToDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (lancamentoToDeleteId) {
      deleteLancamento(lancamentoToDeleteId)
      toast.success('Lançamento excluído com sucesso!')
      setIsDeleteDialogOpen(false)
      setLancamentoToDeleteId(null)
    }
  }

  const handleExport = () => {
    const filename = `lancamentos_${format(new Date(), 'yyyy-MM-dd')}.csv`
    exportToExcel(lancamentos, filename)
  }

  const handleImport = (data: Omit<Lancamento, 'id'>[]) => {
    addMultipleLancamentos(data)
    toast.success('Importação bem-sucedida!', {
      description: `${data.length} novos lançamentos foram adicionados.`,
    })
  }

  return (
    <div className="page-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Lançamentos</h2>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            onClick={() => setIsImportDialogOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" /> Importar CSV
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
        </div>
      </div>

      <NewEntryForm onSubmit={handleAddNewLancamento} />

      <LancamentosTable
        lancamentos={lancamentos}
        onEdit={handleOpenManageDialog}
        onDeleteRequest={handleDeleteRequest}
      />

      <ManageLancamentoDialog
        isOpen={isManageDialogOpen}
        onClose={handleCloseManageDialog}
        onSave={handleSaveEditedLancamento}
        lancamento={selectedLancamento}
      />

      <ImportCsvDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImport}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              lançamento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLancamentoToDeleteId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default LancamentosPage
