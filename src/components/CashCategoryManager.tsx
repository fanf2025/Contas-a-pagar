import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { MoreHorizontal, Edit, Trash2, PlusCircle } from 'lucide-react'
import { useAppStore } from '@/data/store'
import { CashCategory } from '@/types'
import { ManageCashCategoryDialog } from './ManageCashCategoryDialog'
import { toast } from 'sonner'

export const CashCategoryManager = () => {
  const {
    cashCategories,
    addCashCategory,
    updateCashCategory,
    deleteCashCategory,
  } = useAppStore()
  const [isManageOpen, setIsManageOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<CashCategory | null>(null)
  const [toDeleteId, setToDeleteId] = useState<string | null>(null)

  const handleOpenManage = (category: CashCategory | null = null) => {
    setSelected(category)
    setIsManageOpen(true)
  }

  const handleSave = (data: CashCategory) => {
    if (selected) {
      updateCashCategory(data)
      toast.success('Categoria de caixa atualizada com sucesso!')
    } else {
      addCashCategory(data.nome)
      toast.success('Categoria de caixa adicionada com sucesso!')
    }
  }

  const handleDeleteRequest = (id: string) => {
    setToDeleteId(id)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (toDeleteId) {
      deleteCashCategory(toDeleteId)
      toast.success('Categoria de caixa excluída com sucesso!')
      setIsDeleteOpen(false)
      setToDeleteId(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Categorias de Caixa</CardTitle>
            <CardDescription>
              Gerencie as categorias de entradas de caixa (receitas).
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenManage()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[80px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashCategories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.nome}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleOpenManage(cat)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRequest(cat.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ManageCashCategoryDialog
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        onSave={handleSave}
        category={selected}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
