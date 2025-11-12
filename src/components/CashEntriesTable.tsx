import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CashEntry } from '@/types'
import { format, parseISO } from 'date-fns'

type CashEntriesTableProps = {
  entries: CashEntry[]
}

export const CashEntriesTable = ({ entries }: CashEntriesTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Caixa</CardTitle>
        <CardDescription>
          Lista de todas as entradas de caixa registradas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {format(parseISO(entry.date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.origin}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.value.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Nenhum lançamento de caixa encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
