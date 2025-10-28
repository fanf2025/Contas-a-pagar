import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { File, FileText, FileSpreadsheet } from 'lucide-react'

const RelatoriosPage = () => {
  // This is a placeholder. The full implementation will be provided in the next steps.
  return (
    <div className="page-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Relatórios</h2>
      </div>
      <div className="bg-card p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select>
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="Selecione um modelo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cat">Despesas por Categoria</SelectItem>
              <SelectItem value="for">Despesas por Fornecedor</SelectItem>
              <SelectItem value="status">Despesas Pagas x Em Aberto</SelectItem>
            </SelectContent>
          </Select>
          {/* Date filters will be added here */}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">
            <File className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar Excel
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
        </div>
        <div className="mt-6 h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            Selecione um relatório para visualizar os dados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RelatoriosPage
