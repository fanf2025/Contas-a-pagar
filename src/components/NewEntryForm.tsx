import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/data/store'
import { Combobox } from '@/components/ui/combobox'

const newEntrySchema = z.object({
  dataVencimento: z.date({
    required_error: 'A data de vencimento é obrigatória.',
  }),
  categoria: z.string().min(1, 'A categoria é obrigatória.'),
  fornecedor: z.string().optional(),
  numeroDocumento: z.string().min(1, 'O Nº do Documento é obrigatório.'),
  valor: z.coerce.number().min(0.01, 'O valor deve ser maior que zero.'),
})

export type NewEntryFormValues = z.infer<typeof newEntrySchema>

type NewEntryFormProps = {
  onSubmit: (data: NewEntryFormValues) => void
}

export const NewEntryForm = ({ onSubmit }: NewEntryFormProps) => {
  const { categorias, fornecedores } = useAppStore()

  const form = useForm<NewEntryFormValues>({
    resolver: zodResolver(newEntrySchema),
    defaultValues: {
      numeroDocumento: '',
      fornecedor: '',
    },
  })

  const categoriaOptions = categorias.map((c) => ({
    value: c.nome,
    label: c.nome,
  }))
  const fornecedorOptions = fornecedores.map((f) => ({
    value: f.nome,
    label: f.nome,
  }))

  const handleFormSubmit = (data: NewEntryFormValues) => {
    onSubmit(data)
    form.reset({
      numeroDocumento: '',
      fornecedor: '',
      valor: undefined,
      categoria: undefined,
      dataVencimento: undefined,
    })
  }

  return (
    <Card className="mb-6 animate-fade-in">
      <CardHeader>
        <CardTitle>Adicionar Novo Lançamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-start"
          >
            <FormField
              control={form.control}
              name="dataVencimento"
              render={({ field }) => (
                <FormItem className="flex flex-col lg:col-span-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, 'dd/MM/yyyy')
                          ) : (
                            <span>Vencimento</span>
                          )}
                        </Button>
                      </FormControl>
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
                  <FormMessage className="pt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem className="lg:col-span-1">
                  <Combobox
                    options={categoriaOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Categoria"
                    searchPlaceholder="Buscar categoria..."
                    emptyMessage="Nenhuma categoria."
                  />
                  <FormMessage className="pt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fornecedor"
              render={({ field }) => (
                <FormItem className="lg:col-span-1">
                  <Combobox
                    options={fornecedorOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Fornecedor"
                    searchPlaceholder="Buscar fornecedor..."
                    emptyMessage="Nenhum fornecedor."
                  />
                  <FormMessage className="pt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numeroDocumento"
              render={({ field }) => (
                <FormItem className="lg:col-span-1">
                  <FormControl>
                    <Input placeholder="Nº Doc." {...field} />
                  </FormControl>
                  <FormMessage className="pt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem className="lg:col-span-1">
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Valor (R$)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="pt-1" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full lg:col-span-1">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
