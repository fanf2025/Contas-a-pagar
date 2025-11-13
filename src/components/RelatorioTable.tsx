import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { format, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'

type ReportItem = {
  id: string
  date: string
  description: string
  category: string
  type: 'Receita' | 'Despesa'
  value: number
}

type RelatorioTableProps = {
  data: ReportItem[]
}

export const RelatorioTable = ({ data }: RelatorioTableProps) => {
  const totalReceitas = data
    .filter((item) => item.type === 'Receita')
    .reduce((acc, item) => acc + item.value, 0)
  const totalDespesas = data
    .filter((item) => item.type === 'Despesa')
    .reduce((acc, item) => acc + item.value, 0)
  const saldo = totalReceitas - totalDespesas

  return (
    <div className="rounded-lg border shadow-sm mt-6 animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {format(parseISO(item.date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className="font-medium">
                  {item.description}
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      item.type === 'Receita'
                        ? 'text-success'
                        : 'text-destructive',
                    )}
                  >
                    {item.type}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {item.value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Nenhum dado encontrado para os filtros selecionados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {data.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-right font-bold">
                Total Receitas
              </TableCell>
              <TableCell className="text-right font-bold text-success">
                {totalReceitas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="text-right font-bold">
                Total Despesas
              </TableCell>
              <TableCell className="text-right font-bold text-destructive">
                {totalDespesas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="text-right font-bold text-lg">
                Saldo
              </TableCell>
              <TableCell
                className={cn(
                  'text-right font-bold text-lg',
                  saldo >= 0 ? 'text-primary' : 'text-destructive',
                )}
              >
                {saldo.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  )
}
