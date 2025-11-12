import { useState } from 'react'
import { useAppStore } from '@/data/store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { KpiCard } from '@/components/KpiCard'
import {
  ArrowDown,
  CheckCircle,
  Upload,
  Landmark,
  Wallet,
  ArrowUp,
} from 'lucide-react'
import { ExpensesByCategoryChart } from '@/components/charts/ExpensesByCategoryChart'
import { ExpensesBySupplierChart } from '@/components/charts/ExpensesBySupplierChart'
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
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { format, parseISO } from 'date-fns'

const meses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]
const anos = [2024, 2025, 2026]

const Dashboard = () => {
  const [mes, setMes] = useState(meses[new Date().getMonth()])
  const [ano, setAno] = useState(new Date().getFullYear())
  const { lancamentos, cashEntries } = useAppStore()
  const { newTransactionImportsEnabled } = useSettingsStore()

  const handleSimulateImport = () => {
    if (newTransactionImportsEnabled) {
      toast.success('Novas transações importadas com sucesso!', {
        description: '5 novas despesas foram adicionadas à sua lista.',
      })
    } else {
      toast.info('A importação foi concluída.', {
        description: 'As notificações de importação estão desativadas.',
      })
    }
  }

  // Overall calculations
  const totalContasAPagar = lancamentos
    .filter((l) => !l.dataPagamento)
    .reduce((acc, l) => acc + l.valor, 0)
  const totalLancamentosCaixa = cashEntries.reduce((acc, e) => acc + e.value, 0)
  const saldo = totalLancamentosCaixa - totalContasAPagar
  const recentCashEntries = cashEntries
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
    .slice(0, 5)

  // Filtered calculations for the selected period
  const filteredLancamentos = lancamentos.filter(
    (l) => l.mes === mes && l.ano === ano,
  )
  const totalDespesas = filteredLancamentos.reduce((acc, l) => acc + l.valor, 0)
  const totalPago = filteredLancamentos.reduce((acc, l) => acc + l.valorPago, 0)

  const despesasPorCategoria = filteredLancamentos.reduce(
    (acc, l) => {
      if (!acc[l.categoria]) {
        acc[l.categoria] = 0
      }
      acc[l.categoria] += l.valor
      return acc
    },
    {} as Record<string, number>,
  )
  const despesasPorCategoriaData = Object.entries(despesasPorCategoria)
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total)

  const despesasPorFornecedor = filteredLancamentos.reduce(
    (acc, l) => {
      if (l.fornecedor !== 'N/A') {
        if (!acc[l.fornecedor]) {
          acc[l.fornecedor] = 0
        }
        acc[l.fornecedor] += l.valor
      }
      return acc
    },
    {} as Record<string, number>,
  )
  const despesasPorFornecedorData = Object.entries(despesasPorFornecedor)
    .map(([fornecedor, total]) => ({ fornecedor, total }))
    .sort((a, b) => b.total - a.total)

  return (
    <div className="page-content space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select value={mes} onValueChange={setMes}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {meses.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(ano)} onValueChange={(v) => setAno(Number(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {anos.map((a) => (
                <SelectItem key={a} value={String(a)}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleSimulateImport}>
          <Upload className="mr-2 h-4 w-4" /> Simular Importação
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Total de Contas a Pagar"
          value={totalContasAPagar}
          icon={<ArrowDown />}
          colorClass="text-destructive"
        />
        <KpiCard
          title="Total Lançado em Caixa"
          value={totalLancamentosCaixa}
          icon={<ArrowUp />}
          colorClass="text-success"
        />
        <KpiCard
          title="Saldo"
          value={saldo}
          icon={<Wallet />}
          colorClass="text-primary"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <KpiCard
          title={`Total em Despesas (${mes})`}
          value={totalDespesas}
          icon={<Landmark />}
          colorClass="text-destructive"
        />
        <KpiCard
          title={`Total Pago (${mes})`}
          value={totalPago}
          icon={<CheckCircle />}
          colorClass="text-success"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ExpensesByCategoryChart data={despesasPorCategoriaData} />
        <ExpensesBySupplierChart data={despesasPorFornecedorData} />
      </div>

      <Card className="animate-slide-up" style={{ animationDelay: '600ms' }}>
        <CardHeader>
          <CardTitle>Lançamento do Caixa</CardTitle>
          <CardDescription>
            Últimas 5 entradas de caixa registradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCashEntries.length > 0 ? (
                recentCashEntries.map((entry) => (
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
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
