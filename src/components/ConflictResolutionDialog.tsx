import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useSyncStore } from '@/stores/useSyncStore'
import { DataConflict } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { format, parseISO } from 'date-fns'

const LancamentoConflictDetails = ({
  conflict,
}: {
  conflict: DataConflict
}) => {
  if (conflict.type !== 'LANCAMENTO') return null

  const local = conflict.local
  const server = conflict.server

  return (
    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
      <Card>
        <CardHeader>
          <CardTitle>Versão Local (Suas Alterações)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Descrição:</strong> {local.descricao}
          </p>
          <p>
            <strong>Vencimento:</strong>{' '}
            {format(parseISO(local.dataVencimento), 'dd/MM/yyyy')}
          </p>
          <p>
            <strong>Valor:</strong>{' '}
            <span className="font-bold">
              {local.valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Versão do Servidor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Descrição:</strong> {server.descricao}
          </p>
          <p>
            <strong>Vencimento:</strong>{' '}
            {format(parseISO(server.dataVencimento), 'dd/MM/yyyy')}
          </p>
          <p>
            <strong>Valor:</strong>{' '}
            <span className="font-bold">
              {server.valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export const ConflictResolutionDialog = () => {
  const { conflict, resolveConflict } = useSyncStore()

  if (!conflict) {
    return null
  }

  return (
    <AlertDialog open={!!conflict}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Resolver Conflito de Sincronização
          </AlertDialogTitle>
          <AlertDialogDescription>
            Foram detectadas alterações conflitantes para o mesmo item. Por
            favor, escolha qual versão manter.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <LancamentoConflictDetails conflict={conflict} />

        <AlertDialogFooter className="mt-4">
          <Button variant="outline" onClick={() => resolveConflict('server')}>
            Manter Versão do Servidor
          </Button>
          <Button onClick={() => resolveConflict('local')}>
            Manter Minhas Alterações (Local)
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
