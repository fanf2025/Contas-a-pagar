import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAnalyticsStore } from '@/stores/useAnalyticsStore'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useEffect } from 'react'

const analyticsSchema = z.object({
  gaMeasurementId: z
    .string()
    .regex(
      /^(G-[A-Z0-9]{10}|UA-[0-9]{4,9}-[0-9]{1,4})$/,
      'Formato de ID inválido. Use G-XXXXXXXXXX ou UA-XXXXXXXXX-X.',
    )
    .or(z.literal('')),
})

type AnalyticsFormValues = z.infer<typeof analyticsSchema>

export const AnalyticsManager = () => {
  const {
    gaMeasurementId,
    isAnalyticsEnabled,
    setGaMeasurementId,
    setIsAnalyticsEnabled,
  } = useAnalyticsStore()

  const form = useForm<AnalyticsFormValues>({
    resolver: zodResolver(analyticsSchema),
    defaultValues: {
      gaMeasurementId: gaMeasurementId || '',
    },
  })

  useEffect(() => {
    form.setValue('gaMeasurementId', gaMeasurementId || '')
  }, [gaMeasurementId, form])

  const onSubmit = (data: AnalyticsFormValues) => {
    const newId = data.gaMeasurementId || null
    setGaMeasurementId(newId)
    if (!newId) {
      setIsAnalyticsEnabled(false)
    }
    toast.success('Configurações de analytics salvas com sucesso!')
  }

  return (
    <Card>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Integração com Analytics</CardTitle>
          <CardDescription>
            Conecte sua aplicação ao Google Analytics para obter insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gaMeasurementId">
              Google Analytics Measurement ID
            </Label>
            <Input
              id="gaMeasurementId"
              placeholder="G-XXXXXXXXXX"
              {...form.register('gaMeasurementId')}
            />
            {form.formState.errors.gaMeasurementId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.gaMeasurementId.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>Rastreamento do Google Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Ative para começar a coletar dados de tráfego e comportamento.
              </p>
            </div>
            <Switch
              checked={isAnalyticsEnabled}
              onCheckedChange={setIsAnalyticsEnabled}
              disabled={!gaMeasurementId}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Salvar Configurações</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
