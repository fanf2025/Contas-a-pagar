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
import { ArrowDown, CheckCircle } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
  const lancamentos = useAppStore((state) => state.lancamentos)

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

  const top10Categorias = despesasPorCategoriaData.slice(0, 10)

  return (
    <div className="page-content">
      <div className="flex justify-end gap-4 mb-6">
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

      <div className="grid gap-6 md:grid-cols-2">
        <KpiCard
          title="Total em Despesas"
          value={totalDespesas}
          icon={<ArrowDown />}
          colorClass="text-destructive"
        />
        <KpiCard
          title="Total Pago"
          value={totalPago}
          icon={<CheckCircle />}
          colorClass="text-success"
        />
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <ExpensesByCategoryChart data={despesasPorCategoriaData} />
        <ExpensesBySupplierChart data={despesasPorFornecedorData} />
      </div>

      <Card
        className="mt-6 animate-slide-up"
        style={{ animationDelay: '600ms' }}
      >
        <CardHeader>
          <CardTitle>Top 10 Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top10Categorias.map((item) => (
                <TableRow key={item.categoria}>
                  <TableCell className="font-medium">
                    {item.categoria}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
