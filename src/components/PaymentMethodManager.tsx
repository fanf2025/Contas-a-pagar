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
import { FormaPagamento } from '@/types'
import { ManagePaymentMethodDialog } from './ManagePaymentMethodDialog'
import { toast } from 'sonner'

export const PaymentMethodManager = () => {
  const {
    formasPagamento,
    addFormaPagamento,
    updateFormaPagamento,
    deleteFormaPagamento,
  } = useAppStore()
  const [isManageOpen, setIsManageOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<FormaPagamento | null>(null)
  const [toDeleteId, setToDeleteId] = useState<string | null>(null)

  const handleOpenManage = (paymentMethod: FormaPagamento | null = null) => {
    setSelected(paymentMethod)
    setIsManageOpen(true)
  }

  const handleSave = (data: FormaPagamento) => {
    if (selected) {
      updateFormaPagamento(data)
      toast.success('Forma de pagamento atualizada com sucesso!')
    } else {
      addFormaPagamento(data.nome)
      toast.success('Forma de pagamento adicionada com sucesso!')
    }
  }

  const handleDeleteRequest = (id: string) => {
    setToDeleteId(id)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (toDeleteId) {
      deleteFormaPagamento(toDeleteId)
      toast.success('Forma de pagamento excluída com sucesso!')
      setIsDeleteOpen(false)
      setToDeleteId(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Formas de Pagamento</CardTitle>
            <CardDescription>Gerencie as formas de pagamento.</CardDescription>
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
                {formasPagamento.map((pm) => (
                  <TableRow key={pm.id}>
                    <TableCell className="font-medium">{pm.nome}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleOpenManage(pm)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRequest(pm.id)}
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

      <ManagePaymentMethodDialog
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        onSave={handleSave}
        paymentMethod={selected}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta forma de pagamento? Esta ação
              não pode ser desfeita.
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
