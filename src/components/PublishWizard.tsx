import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { StepIndicator } from './StepIndicator'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Globe, Smartphone, Apple, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

type DeploymentType = 'web' | 'ios' | 'android' | null
type DeploymentStatus = 'idle' | 'building' | 'deploying' | 'success' | 'failed'

const webConfigSchema = z.object({
  domain: z
    .string()
    .min(3, 'O domínio é obrigatório.')
    .url('URL de domínio inválida.'),
})
type WebConfigValues = z.infer<typeof webConfigSchema>

const steps = [
  { id: 1, name: 'Boas-vindas' },
  { id: 2, name: 'Ambiente' },
  { id: 3, name: 'Configuração' },
  { id: 4, name: 'Publicação' },
  { id: 5, name: 'Conclusão' },
]

export const PublishWizard = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [deploymentType, setDeploymentType] = useState<DeploymentType>(null)
  const [deploymentStatus, setDeploymentStatus] =
    useState<DeploymentStatus>('idle')
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [deploymentUrl, setDeploymentUrl] = useState('')

  const webForm = useForm<WebConfigValues>({
    resolver: zodResolver(webConfigSchema),
  })

  const handleNext = () => setCurrentStep((prev) => prev + 1)
  const handleBack = () => setCurrentStep((prev) => prev - 1)

  const startDeployment = async (data: WebConfigValues) => {
    setDeploymentUrl(data.domain)
    setCurrentStep(4)
    setDeploymentStatus('building')
    setProgress(0)
    setDeploymentLogs(['Iniciando processo de publicação...'])

    const logs = [
      'Verificando configurações...',
      'Iniciando build de produção...',
      'Otimizando assets...',
      'Build concluído com sucesso.',
      'Iniciando publicação no servidor...',
      'Configurando DNS...',
      'Verificando certificado SSL...',
      'Publicação concluída!',
    ]

    for (let i = 0; i < logs.length; i++) {
      await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000))
      setDeploymentLogs((prev) => [...prev, logs[i]])
      setProgress(((i + 1) / logs.length) * 100)
      if (i > 3) setDeploymentStatus('deploying')
    }

    setDeploymentStatus('success')
    toast.success('Aplicação publicada com sucesso!')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <h3 className="text-xl font-semibold">
              Bem-vindo ao Assistente de Publicação
            </h3>
            <p className="text-muted-foreground mt-2">
              Este guia irá ajudá-lo a publicar sua aplicação passo a passo.
            </p>
          </div>
        )
      case 2:
        return (
          <div>
            <h3 className="text-xl font-semibold text-center mb-6">
              Selecione o Ambiente de Publicação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(
                [
                  { type: 'web', icon: Globe, label: 'Web' },
                  { type: 'ios', icon: Apple, label: 'iOS (Em Breve)' },
                  {
                    type: 'android',
                    icon: Smartphone,
                    label: 'Android (Em Breve)',
                  },
                ] as const
              ).map(({ type, icon: Icon, label }) => (
                <Card
                  key={type}
                  onClick={() => type === 'web' && setDeploymentType(type)}
                  className={cn(
                    'cursor-pointer hover:border-primary transition-colors',
                    deploymentType === type &&
                      'border-primary ring-2 ring-primary',
                    type !== 'web' && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Icon className="h-12 w-12 mb-4" />
                    <span className="font-medium">{label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold text-center mb-6">
              Configurar Publicação Web
            </h3>
            <form
              onSubmit={webForm.handleSubmit(startDeployment)}
              className="max-w-md mx-auto space-y-4"
            >
              <div>
                <Label htmlFor="domain">Domínio</Label>
                <Input
                  id="domain"
                  placeholder="https://meuapp.com"
                  {...webForm.register('domain')}
                />
                {webForm.formState.errors.domain && (
                  <p className="text-sm text-destructive mt-1">
                    {webForm.formState.errors.domain.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Iniciar Publicação
              </Button>
            </form>
          </div>
        )
      case 4:
        return (
          <div>
            <h3 className="text-xl font-semibold text-center mb-4">
              Publicação em Andamento
            </h3>
            <Progress value={progress} className="mb-4" />
            <p className="text-center text-sm text-muted-foreground mb-4">
              Status: {deploymentStatus}
            </p>
            <div className="bg-muted rounded-md p-4 h-64 overflow-y-auto font-mono text-sm">
              {deploymentLogs.map((log, i) => (
                <p key={i}>{`> ${log}`}</p>
              ))}
            </div>
          </div>
        )
      case 5:
        return (
          <div className="text-center">
            {deploymentStatus === 'success' ? (
              <>
                <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Publicação Concluída!</h3>
                <p className="text-muted-foreground mt-2">
                  Sua aplicação está disponível em:
                </p>
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline"
                >
                  {deploymentUrl}
                </a>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Falha na Publicação</h3>
                <p className="text-muted-foreground mt-2">
                  Ocorreu um erro. Verifique os logs e tente novamente.
                </p>
              </>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <StepIndicator steps={steps} currentStep={currentStep} />
      <div className="mt-8 p-6 border rounded-lg min-h-[300px] flex items-center justify-center">
        {renderStepContent()}
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || currentStep === 4}
        >
          Voltar
        </Button>
        {currentStep < 3 && (
          <Button
            onClick={handleNext}
            disabled={currentStep === 2 && !deploymentType}
          >
            Avançar
          </Button>
        )}
        {currentStep === 5 && (
          <Button onClick={() => setCurrentStep(1)}>Publicar Novamente</Button>
        )}
      </div>
    </div>
  )
}
