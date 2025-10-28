import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Lancamento, Categoria, Fornecedor, FormaPagamento } from '@/types'
import { format } from 'date-fns'

const initialCategorias: Categoria[] = [
  { id: '1', nome: 'Fornecedores de Medicamentos' },
  { id: '2', nome: 'Aluguel' },
  { id: '3', nome: 'Salários e Encargos' },
  { id: '4', nome: 'Marketing e Publicidade' },
  { id: '5', nome: 'Manutenção e Reparos' },
  { id: '6', nome: 'Impostos e Taxas' },
  { id: '7', nome: 'Material de Escritório' },
  { id: '8', nome: 'Serviços de Contabilidade' },
  { id: '9', nome: 'Software e TI' },
  { id: '10', nome: 'Outras Despesas' },
]

const initialFornecedores: Fornecedor[] = [
  { id: '1', nome: 'MedDistribuidora' },
  { id: '2', nome: 'FarmaLog' },
  { id: '3', nome: 'Imobiliária Central' },
  { id: '4', nome: 'Agência Criativa' },
  { id: '5', nome: 'Contabiliza S.A.' },
]

const initialFormasPagamento: FormaPagamento[] = [
  { id: '1', nome: 'Boleto Bancário' },
  { id: '2', nome: 'Transferência (PIX)' },
  { id: '3', nome: 'Cartão de Crédito' },
  { id: '4', nome: 'Débito em Conta' },
]

const initialLancamentos: Lancamento[] = [
  {
    id: '1',
    data: '2025-07-10',
    mes: 'Julho',
    ano: 2025,
    tipo: 'DESPESAS',
    categoria: 'Fornecedores de Medicamentos',
    descricao: 'Compra de analgésicos',
    fornecedor: 'MedDistribuidora',
    valor: 1500.75,
    valorPago: 1500.75,
    tipoPagamento: 'Boleto Bancário',
    dataPagamento: '2025-07-10',
  },
  {
    id: '2',
    data: '2025-07-05',
    mes: 'Julho',
    ano: 2025,
    tipo: 'DESPESAS',
    categoria: 'Aluguel',
    descricao: 'Aluguel da loja',
    fornecedor: 'Imobiliária Central',
    valor: 5000.0,
    valorPago: 5000.0,
    tipoPagamento: 'Débito em Conta',
    dataPagamento: '2025-07-05',
  },
  {
    id: '3',
    data: '2025-07-15',
    mes: 'Julho',
    ano: 2025,
    tipo: 'DESPESAS',
    categoria: 'Salários e Encargos',
    descricao: 'Adiantamento salarial',
    fornecedor: 'N/A',
    valor: 8000.0,
    valorPago: 0,
    tipoPagamento: 'Transferência (PIX)',
    dataPagamento: null,
  },
  {
    id: '4',
    data: '2025-06-20',
    mes: 'Junho',
    ano: 2025,
    tipo: 'DESPESAS',
    categoria: 'Marketing e Publicidade',
    descricao: 'Impulsionamento redes sociais',
    fornecedor: 'Agência Criativa',
    valor: 850.0,
    valorPago: 850.0,
    tipoPagamento: 'Cartão de Crédito',
    dataPagamento: '2025-06-20',
  },
]

interface AppState {
  lancamentos: Lancamento[]
  categorias: Categoria[]
  fornecedores: Fornecedor[]
  formasPagamento: FormaPagamento[]
  addLancamento: (lancamento: Omit<Lancamento, 'id'>) => void
  updateLancamento: (lancamento: Lancamento) => void
  deleteLancamento: (id: string) => void
  addCategoria: (nome: string) => void
  updateCategoria: (categoria: Categoria) => void
  deleteCategoria: (id: string) => void
  addFornecedor: (nome: string) => void
  updateFornecedor: (fornecedor: Fornecedor) => void
  deleteFornecedor: (id: string) => void
  addFormaPagamento: (nome: string) => void
  updateFormaPagamento: (forma: FormaPagamento) => void
  deleteFormaPagamento: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lancamentos: initialLancamentos,
      categorias: initialCategorias,
      fornecedores: initialFornecedores,
      formasPagamento: initialFormasPagamento,

      addLancamento: (lancamento) =>
        set((state) => ({
          lancamentos: [
            ...state.lancamentos,
            { ...lancamento, id: new Date().toISOString() },
          ],
        })),
      updateLancamento: (lancamento) =>
        set((state) => ({
          lancamentos: state.lancamentos.map((l) =>
            l.id === lancamento.id ? lancamento : l,
          ),
        })),
      deleteLancamento: (id) =>
        set((state) => ({
          lancamentos: state.lancamentos.filter((l) => l.id !== id),
        })),

      addCategoria: (nome) =>
        set((state) => ({
          categorias: [
            ...state.categorias,
            { nome, id: new Date().toISOString() },
          ],
        })),
      updateCategoria: (categoria) =>
        set((state) => ({
          categorias: state.categorias.map((c) =>
            c.id === categoria.id ? categoria : c,
          ),
        })),
      deleteCategoria: (id) =>
        set((state) => ({
          categorias: state.categorias.filter((c) => c.id !== id),
        })),

      addFornecedor: (nome) =>
        set((state) => ({
          fornecedores: [
            ...state.fornecedores,
            { nome, id: new Date().toISOString() },
          ],
        })),
      updateFornecedor: (fornecedor) =>
        set((state) => ({
          fornecedores: state.fornecedores.map((f) =>
            f.id === fornecedor.id ? fornecedor : f,
          ),
        })),
      deleteFornecedor: (id) =>
        set((state) => ({
          fornecedores: state.fornecedores.filter((f) => f.id !== id),
        })),

      addFormaPagamento: (nome) =>
        set((state) => ({
          formasPagamento: [
            ...state.formasPagamento,
            { nome, id: new Date().toISOString() },
          ],
        })),
      updateFormaPagamento: (forma) =>
        set((state) => ({
          formasPagamento: state.formasPagamento.map((f) =>
            f.id === forma.id ? forma : f,
          ),
        })),
      deleteFormaPagamento: (id) =>
        set((state) => ({
          formasPagamento: state.formasPagamento.filter((f) => f.id !== id),
        })),
    }),
    {
      name: 'contas-a-pagar-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
