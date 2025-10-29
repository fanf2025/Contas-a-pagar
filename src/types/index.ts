export type Lancamento = {
  id: string
  data: string
  dataVencimento: string
  mes: string
  ano: number
  tipo: 'DESPESAS'
  categoria: string
  descricao: string
  fornecedor: string
  numeroDocumento: string
  valor: number
  valorPago: number
  tipoPagamento: string
  dataPagamento: string | null
  juros?: number
}

export type Categoria = {
  id: string
  nome: string
}

export type Fornecedor = {
  id: string
  nome: string
}

export type FormaPagamento = {
  id: string
  nome: string
}

export type GoalContribution = {
  id: string
  goalId: string
  amount: number
  date: string
}

export type FinancialGoal = {
  id: string
  name: string
  targetAmount: number
  targetDate: string
  contributions: GoalContribution[]
}
