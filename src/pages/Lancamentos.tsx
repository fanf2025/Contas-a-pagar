import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Upload,
  Download,
  PlusCircle,
  Search,
  X,
  CalendarIcon,
} from 'lucide-react'
import { useAppStore } from '@/data/store'
import { Lancamento, CashEntry } from '@/types'
import { LancamentosTable } from '@/components/LancamentosTable'
import { ManageLancamentoDialog } from '@/components/ManageLancamentoDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'
import { useExcelExport } from '@/hooks/useExcelExport'
import { ImportCsvDialog } from '@/components/ImportCsvDialog'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CashEntryForm } from '@/components/CashEntryForm'
import { CashEntriesTable } from '@/components/CashEntriesTable'
import { ManageCashEntryDialog } from '@/components/ManageCashEntryDialog'

const LancamentosPage = () => {
  const {
    lancamentos,
    addLancamento,
    updateLancamento,
    deleteLancamento,
    addMultipleLancamentos,
    categorias,
    fornecedores,
    cashEntries,
    updateCashEntry,
    deleteCashEntry,
  } = useAppStore()

  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false)
  const [selectedLancamento, setSelectedLancamento] =
    useState<Lancamento | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [lancamentoToDeleteId, setLancamentoToDeleteId] = useState<
    string | null
  >(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const { exportToExcel } = useExcelExport()

  const [isManageCashEntryDialogOpen, setIsManageCashEntryDialogOpen] =
    useState(false)
  const [selectedCashEntry, setSelectedCashEntry] = useState<CashEntry | null>(
    null,
  )
  const [isDeleteCashEntryDialogOpen, setIsDeleteCashEntryDialogOpen] =
    useState(false)
  const [cashEntryToDeleteId, setCashEntryToDeleteId] = useState<string | null>(
    null,
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [supplierFilter, setSupplierFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>()

  const filteredLancamentos = useMemo(() => {
    return lancamentos.filter((l) => {
      const searchTermLower = searchTerm.toLowerCase()
      const matchesSearch =
        l.numeroDocumento.toLowerCase().includes(searchTermLower) ||
        l.categoria.toLowerCase().includes(searchTermLower) ||
        l.fornecedor.toLowerCase().includes(searchTermLower)

      const matchesCategory =
        categoryFilter === 'all' || l.categoria === categoryFilter
      const matchesSupplier =
        supplierFilter === 'all' || l.fornecedor === supplierFilter

      const vencimentoDate = parseISO(l.dataVencimento)
      const matchesDate =
        !dateFilter ||
        (!dateFilter.from && !dateFilter.to) ||
        (dateFilter.from &&
          !dateFilter.to &&
          vencimentoDate >= dateFilter.from) ||
        (!dateFilter.from &&
          dateFilter.to &&
          vencimentoDate <= dateFilter.to) ||
        (dateFilter.from &&
          dateFilter.to &&
          vencimentoDate >= dateFilter.from &&
          vencimentoDate <= dateFilter.to)

      return matchesSearch && matchesCategory && matchesSupplier && matchesDate
    })
  }, [lancamentos, searchTerm, categoryFilter, supplierFilter, dateFilter])

  const handleOpenManageDialog = (lancamento: Lancamento | null = null) => {
    setSelectedLancamento(lancamento)
    setIsManageDialogOpen(true)
  }

  const handleCloseManageDialog = () => {
    setSelectedLancamento(null)
    setIsManageDialogOpen(false)
  }

  const handleSaveLancamento = (
    data: Omit<
      Lancamento,
      | 'id'
      | 'mes'
      | 'ano'
      | 'tipo'
      | 'valorPago'
      | 'dataPagamento'
      | 'juros'
      | 'data'
    >,
  ) => {
    const today = new Date()
    const lancamentoData = {
      ...data,
      data: format(today, 'yyyy-MM-dd'),
      mes: format(today, 'MMMM', { locale: ptBR }),
      ano: today.getFullYear(),
    }

    if (selectedLancamento) {
      updateLancamento({ ...selectedLancamento, ...lancamentoData })
      toast.success('Lançamento atualizado com sucesso!')
    } else {
      addLancamento({
        ...lancamentoData,
        tipo: 'DESPESAS' as const,
        valorPago: 0,
        dataPagamento: null,
        juros: 0,
      })
      toast.success('Lançamento criado com sucesso!')
    }
  }

  const handleDeleteRequest = (id: string) => {
    setLancamentoToDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (lancamentoToDeleteId) {
      deleteLancamento(lancamentoToDeleteId)
      toast.success('Lançamento excluído com sucesso!')
      setIsDeleteDialogOpen(false)
      setLancamentoToDeleteId(null)
    }
  }

  const handleExport = () => {
    const filename = `lancamentos_${format(new Date(), 'yyyy-MM-dd')}.csv`
    exportToExcel(filteredLancamentos, filename)
  }

  const handleImport = (data: Omit<Lancamento, 'id'>[]) => {
    addMultipleLancamentos(data)
    toast.success('Importação bem-sucedida!', {
      description: `${data.length} novos lançamentos foram adicionados.`,
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('all')
    setSupplierFilter('all')
    setDateFilter(undefined)
  }

  const handleOpenManageCashEntry = (entry: CashEntry) => {
    setSelectedCashEntry(entry)
    setIsManageCashEntryDialogOpen(true)
  }

  const handleCloseManageCashEntry = () => {
    setSelectedCashEntry(null)
    setIsManageCashEntryDialogOpen(false)
  }

  const handleSaveCashEntry = (data: CashEntry) => {
    updateCashEntry(data)
    toast.success('Lançamento de caixa atualizado com sucesso!')
  }

  const handleDeleteCashEntryRequest = (id: string) => {
    setCashEntryToDeleteId(id)
    setIsDeleteCashEntryDialogOpen(true)
  }

  const handleDeleteCashEntryConfirm = () => {
    if (cashEntryToDeleteId) {
      deleteCashEntry(cashEntryToDeleteId)
      toast.success('Lançamento de caixa excluído com sucesso!')
      setIsDeleteCashEntryDialogOpen(false)
      setCashEntryToDeleteId(null)
    }
  }

  return (
    <div className="page-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Lançamentos</h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => handleOpenManageDialog(null)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Novo
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsImportDialogOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" /> Importar
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>
      </div>

      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por Nº Doc, categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categorias.map((c) => (
                <SelectItem key={c.id} value={c.nome}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={supplierFilter} onValueChange={setSupplierFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Fornecedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Fornecedores</SelectItem>
              {fornecedores.map((f) => (
                <SelectItem key={f.id} value={f.nome}>
                  {f.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter?.from ? (
                  dateFilter.to ? (
                    `${format(dateFilter.from, 'dd/MM/yy')} - ${format(dateFilter.to, 'dd/MM/yy')}`
                  ) : (
                    format(dateFilter.from, 'dd/MM/yyyy')
                  )
                ) : (
                  <span>Vencimento</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={dateFilter}
                onSelect={setDateFilter}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" /> Limpar Filtros
          </Button>
        </div>
      </Card>

      <LancamentosTable
        lancamentos={filteredLancamentos}
        onEdit={handleOpenManageDialog}
        onDeleteRequest={handleDeleteRequest}
      />

      <Separator className="my-8" />

      <div className="space-y-6">
        <CashEntryForm />
        <CashEntriesTable
          entries={cashEntries}
          onEdit={handleOpenManageCashEntry}
          onDelete={handleDeleteCashEntryRequest}
        />
      </div>

      <ManageLancamentoDialog
        isOpen={isManageDialogOpen}
        onClose={handleCloseManageDialog}
        onSave={handleSaveLancamento}
        lancamento={selectedLancamento}
      />

      <ImportCsvDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImport}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              lançamento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLancamentoToDeleteId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ManageCashEntryDialog
        isOpen={isManageCashEntryDialogOpen}
        onClose={handleCloseManageCashEntry}
        onSave={handleSaveCashEntry}
        entry={selectedCashEntry}
      />

      <AlertDialog
        open={isDeleteCashEntryDialogOpen}
        onOpenChange={setIsDeleteCashEntryDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              lançamento de caixa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCashEntryToDeleteId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCashEntryConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default LancamentosPage
