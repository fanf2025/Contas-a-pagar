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
import { Fornecedor } from '@/types'
import { ManageSupplierDialog } from './ManageSupplierDialog'
import { toast } from 'sonner'

export const SupplierManager = () => {
  const { fornecedores, addFornecedor, updateFornecedor, deleteFornecedor } =
    useAppStore()
  const [isManageOpen, setIsManageOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Fornecedor | null>(null)
  const [toDeleteId, setToDeleteId] = useState<string | null>(null)

  const handleOpenManage = (supplier: Fornecedor | null = null) => {
    setSelected(supplier)
    setIsManageOpen(true)
  }

  const handleSave = (data: Fornecedor) => {
    if (selected) {
      updateFornecedor(data)
      toast.success('Fornecedor atualizado com sucesso!')
    } else {
      addFornecedor(data.nome)
      toast.success('Fornecedor adicionado com sucesso!')
    }
  }

  const handleDeleteRequest = (id: string) => {
    setToDeleteId(id)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (toDeleteId) {
      deleteFornecedor(toDeleteId)
      toast.success('Fornecedor excluído com sucesso!')
      setIsDeleteOpen(false)
      setToDeleteId(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fornecedores</CardTitle>
            <CardDescription>Gerencie os fornecedores.</CardDescription>
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
                {fornecedores.map((sup) => (
                  <TableRow key={sup.id}>
                    <TableCell className="font-medium">{sup.nome}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleOpenManage(sup)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRequest(sup.id)}
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

      <ManageSupplierDialog
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        onSave={handleSave}
        supplier={selected}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este fornecedor? Esta ação não pode
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
