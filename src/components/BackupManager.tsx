import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { useBackupStore } from '@/stores/useBackupStore'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { HardDriveDownload, RotateCcw, Trash2 } from 'lucide-react'

export const BackupManager = () => {
  const {
    frequency,
    backups,
    setFrequency,
    createBackup,
    restoreFromBackup,
    deleteBackup,
  } = useBackupStore()
  const [toRestore, setToRestore] = useState<string | null>(null)
  const [toDelete, setToDelete] = useState<string | null>(null)

  const sortedBackups = [...backups].sort((a, b) =>
    b.timestamp.localeCompare(a.timestamp),
  )

  const handleRestoreConfirm = () => {
    if (toRestore) {
      restoreFromBackup(toRestore)
      setToRestore(null)
    }
  }

  const handleDeleteConfirm = () => {
    if (toDelete) {
      deleteBackup(toDelete)
      setToDelete(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Backup e Restauração</CardTitle>
          <CardDescription>
            Gerencie backups locais automáticos para proteger seus dados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <p className="font-medium">Frequência do Backup Automático</p>
              <p className="text-sm text-muted-foreground">
                Com que frequência os backups locais devem ser criados.
              </p>
            </div>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diariamente</SelectItem>
                <SelectItem value="weekly">Semanalmente</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h4 className="font-medium mb-2">Backups Disponíveis</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Arquivo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBackups.length > 0 ? (
                    sortedBackups.map((backup) => (
                      <TableRow key={backup.timestamp}>
                        <TableCell>
                          {format(
                            parseISO(backup.timestamp),
                            'dd/MM/yyyy HH:mm',
                            {
                              locale: ptBR,
                            },
                          )}
                        </TableCell>
                        <TableCell>{backup.filename}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setToRestore(backup.timestamp)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" /> Restaurar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setToDelete(backup.timestamp)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        Nenhum backup encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={createBackup}>
            <HardDriveDownload className="mr-2 h-4 w-4" /> Criar Backup Agora
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={!!toRestore} onOpenChange={() => setToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Restauração</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja restaurar este backup? Todos os dados
              atuais não salvos em backup serão perdidos. Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreConfirm}>
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este backup? Esta ação não pode ser
              desfeita.
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
