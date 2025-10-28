import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PlusCircle } from 'lucide-react'

const ConfiguracoesPage = () => {
  // This is a placeholder. The full implementation will be provided in the next steps.
  return (
    <div className="page-content">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
            <CardDescription>
              Gerencie as categorias de despesas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Categoria
            </Button>
            {/* List of categories will be implemented here */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fornecedores</CardTitle>
            <CardDescription>Gerencie os fornecedores.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Fornecedor
            </Button>
            {/* List of suppliers will be implemented here */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Formas de Pagamento</CardTitle>
            <CardDescription>Gerencie as formas de pagamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Forma de
              Pagamento
            </Button>
            {/* List of payment methods will be implemented here */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ConfiguracoesPage
