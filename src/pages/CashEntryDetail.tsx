import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/data/store'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { format, parseISO } from 'date-fns'

const CashEntryDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { cashEntries, cashCategories } = useAppStore()

  const entry = cashEntries.find((e) => e.id === id)
  const categoryName = entry
    ? cashCategories.find((c) => c.id === entry.categoryId)?.nome
    : 'N/A'

  if (!entry) {
    return (
      <div className="page-content text-center">
        <h2 className="text-2xl font-bold mb-4">
          Lançamento de Caixa Não Encontrado
        </h2>
        <p className="text-muted-foreground mb-4">
          O lançamento que você está procurando não existe ou foi movido.
        </p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="page-content">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Lançamento de Caixa</CardTitle>
          <CardDescription>
            Informações detalhadas sobre a entrada de caixa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">
              Data
            </span>
            <span className="text-lg">
              {format(parseISO(entry.date), 'dd/MM/yyyy')}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">
              Origem
            </span>
            <span className="text-lg font-semibold">{entry.origin}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">
              Categoria
            </span>
            <span className="text-lg">{categoryName}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">
              Valor
            </span>
            <span className="text-2xl font-bold text-success">
              {entry.value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CashEntryDetailPage
