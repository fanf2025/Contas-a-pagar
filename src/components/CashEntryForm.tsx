import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/data/store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const cashEntrySchema = z.object({
  date: z.date({ required_error: 'A data é obrigatória.' }),
  value: z.coerce.number().positive('O valor deve ser maior que zero.'),
  origin: z.string().min(3, 'A origem é obrigatória.'),
  categoryId: z.string({ required_error: 'A categoria é obrigatória.' }),
})

type CashEntryFormValues = z.infer<typeof cashEntrySchema>

export const CashEntryForm = () => {
  const { addCashEntry, cashCategories } = useAppStore()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CashEntryFormValues>({
    resolver: zodResolver(cashEntrySchema),
  })

  const onSubmit = (data: CashEntryFormValues) => {
    addCashEntry({
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
    })
    toast.success('Lançamento de caixa adicionado com sucesso!')
    reset({ date: undefined, value: undefined, origin: '', categoryId: '' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lançamento de Caixa</CardTitle>
        <CardDescription>
          Registre entradas de dinheiro no caixa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label>Data</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                {...register('value')}
              />
              {errors.value && (
                <p className="text-sm text-destructive">
                  {errors.value.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="origin">Origem</Label>
              <Input id="origin" {...register('origin')} />
              {errors.origin && (
                <p className="text-sm text-destructive">
                  {errors.origin.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Categoria</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {cashCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-sm text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Salvar Lançamento</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
