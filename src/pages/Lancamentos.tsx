import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, Upload, Download } from 'lucide-react'
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

const LancamentosPage = () => {
  const { lancamentos, addLancamento, updateLancamento, deleteLancamento } =
    useAppStore()
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false)
  const [selectedLancamento, setSelectedLancamento] =
    useState<Lancamento | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [lancamentoToDeleteId, setLancamentoToDeleteId] = useState<
    string | null
  >(null)

  const handleOpenManageDialog = (lancamento: Lancamento | null = null) => {
    setSelectedLancamento(lancamento)
    setIsManageDialogOpen(true)
  }

  const handleCloseManageDialog = () => {
    setSelectedLancamento(null)
    setIsManageDialogOpen(false)
  }

  const handleSaveLancamento = (
    data: Omit<
      Lancamento,
      'id' | 'mes' | 'ano' | 'tipo' | 'valorPago' | 'dataPagamento'
    >,
  ) => {
    const date = new Date(data.data + 'T00:00:00')
    const lancamentoData = {
      ...data,
      mes: format(date, 'MMMM'),
      ano: date.getFullYear(),
      tipo: 'DESPESAS' as const,
      valorPago: 0,
      dataPagamento: null,
    }

    if (selectedLancamento) {
      updateLancamento({ ...selectedLancamento, ...lancamentoData })
      toast.success('Lançamento atualizado com sucesso!')
    } else {
      addLancamento(lancamentoData)
      toast.success('Lançamento criado com sucesso!')
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

  return (
    <div className="page-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Lançamentos</h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => handleOpenManageDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Lançamento
          </Button>
          <Button variant="secondary">
            <Upload className="mr-2 h-4 w-4" /> Importar CSV
          </Button>
          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
        </div>
      </div>

      <LancamentosTable
        lancamentos={lancamentos}
        onEdit={handleOpenManageDialog}
        onDeleteRequest={handleDeleteRequest}
      />

      <ManageLancamentoDialog
        isOpen={isManageDialogOpen}
        onClose={handleCloseManageDialog}
        onSave={handleSaveLancamento}
        lancamento={selectedLancamento}
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
