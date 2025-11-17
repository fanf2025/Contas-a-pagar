import { useState } from 'react'
import { useAppStore } from '@/data/store'
import { Lancamento } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { format, parseISO } from 'date-fns'
import {
  ProcessarBaixaDialog,
  BaixaFormValues,
} from '@/components/ProcessarBaixaDialog'
import { toast } from 'sonner'
import { useSyncStore } from '@/stores/useSyncStore'
import { useOfflineStore } from '@/stores/useOfflineStore'

const BaixasPage = () => {
  const { lancamentos, updateLancamento } = useAppStore()
  const { isOnline } = useSyncStore()
  const { addAction } = useOfflineStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedLancamento, setSelectedLancamento] =
    useState<Lancamento | null>(null)

  const pendingLancamentos = lancamentos.filter((l) => !l.dataPagamento)

  const handleOpenDialog = (lancamento: Lancamento) => {
    setSelectedLancamento(lancamento)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedLancamento(null)
    setIsDialogOpen(false)
  }

  const handleSaveBaixa = (
    lancamento: Lancamento,
    data: BaixaFormValues & { juros: number },
  ) => {
    const updatedLancamento: Lancamento = {
      ...lancamento,
      valorPago: data.valorPago,
      dataPagamento: format(data.dataPagamento, 'yyyy-MM-dd'),
      tipoPagamento: data.tipoPagamento,
      juros: data.juros,
    }

    updateLancamento(updatedLancamento)

    if (isOnline) {
      toast.success(
        `Pagamento do documento ${lancamento.numeroDocumento} processado com sucesso!`,
      )
    } else {
      addAction({
        type: 'UPDATE_LANCAMENTO',
        payload: updatedLancamento,
      })
      toast.info('Você está offline.', {
        description: `O pagamento foi salvo localmente e será sincronizado quando houver conexão.`,
      })
    }
  }

  return (
    <div className="page-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Baixas de Pagamentos</h2>
      </div>
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Doc</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-center">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingLancamentos.length > 0 ? (
              pendingLancamentos.map((lancamento) => (
                <TableRow key={lancamento.id}>
                  <TableCell className="font-medium">
                    {lancamento.numeroDocumento}
                  </TableCell>
                  <TableCell>{lancamento.fornecedor}</TableCell>
                  <TableCell>
                    {format(parseISO(lancamento.dataVencimento), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    {lancamento.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      onClick={() => handleOpenDialog(lancamento)}
                    >
                      Processar Baixa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma despesa em aberto no momento. Tudo pago!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ProcessarBaixaDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveBaixa}
        lancamento={selectedLancamento}
      />
    </div>
  )
}

export default BaixasPage
