import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Edit, Trash2, Repeat } from 'lucide-react'
import { Lancamento } from '@/types'
import { format, parseISO } from 'date-fns'

type LancamentosTableProps = {
  lancamentos: Lancamento[]
  onEdit: (lancamento: Lancamento) => void
  onDeleteRequest: (id: string) => void
}

export const LancamentosTable = ({
  lancamentos,
  onEdit,
  onDeleteRequest,
}: LancamentosTableProps) => {
  const getStatusVariant = (lancamento: Lancamento) => {
    return lancamento.dataPagamento ? 'secondary' : 'destructive'
  }

  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Nº Doc</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Recorrente</TableHead>
            <TableHead className="text-center">Parcela</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lancamentos.length > 0 ? (
            lancamentos.map((lancamento) => (
              <TableRow key={lancamento.id}>
                <TableCell className="font-medium">
                  {lancamento.descricao}
                </TableCell>
                <TableCell>{lancamento.numeroDocumento}</TableCell>
                <TableCell>
                  {format(parseISO(lancamento.dataVencimento), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>{lancamento.categoria}</TableCell>
                <TableCell className="text-right">
                  {lancamento.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(lancamento)}>
                    {lancamento.dataPagamento ? 'Pago' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {lancamento.recorrente && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Repeat className="h-4 w-4 text-primary mx-auto" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Lançamento Recorrente</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {lancamento.parcelaAtual && lancamento.totalParcelas
                    ? `${lancamento.parcelaAtual}/${lancamento.totalParcelas}`
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(lancamento)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteRequest(lancamento.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Nenhum lançamento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
