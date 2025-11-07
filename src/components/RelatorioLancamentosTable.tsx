import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Lancamento } from '@/types'
import { format, parseISO } from 'date-fns'

type RelatorioLancamentosTableProps = {
  lancamentos: Lancamento[]
}

export const RelatorioLancamentosTable = ({
  lancamentos,
}: RelatorioLancamentosTableProps) => {
  return (
    <div className="rounded-lg border shadow-sm mt-6 animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data de Vencimento</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Nº Doc.</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lancamentos.length > 0 ? (
            lancamentos.map((lancamento) => (
              <TableRow key={lancamento.id}>
                <TableCell>
                  {format(parseISO(lancamento.dataVencimento), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>{lancamento.categoria}</TableCell>
                <TableCell>{lancamento.fornecedor}</TableCell>
                <TableCell>{lancamento.numeroDocumento}</TableCell>
                <TableCell className="text-right">
                  {lancamento.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Nenhum lançamento encontrado para o período selecionado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
