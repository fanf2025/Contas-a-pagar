export type Lancamento = {
  id: string
  data: string
  mes: string
  ano: number
  tipo: 'DESPESAS'
  categoria: string
  descricao: string
  fornecedor: string
  valor: number
  valorPago: number
  tipoPagamento: string
  dataPagamento: string | null
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
