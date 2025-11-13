import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { usePublishStore } from '@/stores/usePublishStore'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
  Copy,
  Lock,
} from 'lucide-react'
import { Badge } from './ui/badge'
import { toast } from 'sonner'

const domainSchema = z.object({
  domain: z
    .string()
    .min(1, 'O domínio é obrigatório.')
    .regex(
      /^(?!-)[A-Za-z0-9-]+([-.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/,
      'Formato de domínio inválido.',
    ),
})

type DomainFormValues = z.infer<typeof domainSchema>

const DnsInstructions = () => {
  const { requiredDnsRecord } = usePublishStore()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado para a área de transferência!')
  }

  return (
    <div className="space-y-4 mt-4">
      <p>
        Para conectar seu domínio e ativar o SSL, adicione o seguinte registro
        CNAME nas configurações de DNS do seu provedor. O HTTPS será ativado
        automaticamente.
      </p>
      <div className="bg-muted p-4 rounded-md font-mono text-sm space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-muted-foreground">Tipo: </span>
            <span>{requiredDnsRecord.type}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(requiredDnsRecord.type)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-muted-foreground">Host/Nome: </span>
            <span>{requiredDnsRecord.host}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(requiredDnsRecord.host)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-muted-foreground">Valor/Destino: </span>
            <span>{requiredDnsRecord.value}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(requiredDnsRecord.value)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        As alterações de DNS podem levar até 48 horas para se propagar.
      </p>
    </div>
  )
}

export const CustomDomainManager = () => {
  const {
    domain,
    status,
    sslStatus,
    dnsError,
    setDomain,
    verifyDomain,
    removeDomain,
  } = usePublishStore()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<DomainFormValues>({
    resolver: zodResolver(domainSchema),
  })

  const onSubmit = (data: DomainFormValues) => {
    setDomain(data.domain)
    form.reset()
  }

  const handleVerify = async () => {
    setIsLoading(true)
    await verifyDomain()
    setIsLoading(false)
  }

  const renderStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>
      case 'active':
        return <Badge className="bg-success text-white">Ativo</Badge>
      case 'error':
        return <Badge variant="destructive">Erro</Badge>
      default:
        return null
    }
  }

  const renderSslStatus = () => {
    if (status !== 'active') return null

    switch (sslStatus) {
      case 'provisioning':
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Provisionando certificado SSL...</span>
          </div>
        )
      case 'active':
        return (
          <div className="flex items-center gap-2 text-sm text-success mt-2">
            <Lock className="h-4 w-4" />
            <span>Certificado SSL ativo. Sua aplicação está segura.</span>
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center gap-2 text-sm text-destructive mt-2">
            <AlertCircle className="h-4 w-4" />
            <span>
              Falha ao provisionar certificado SSL. Tente verificar novamente.
            </span>
          </div>
        )
      default:
        return null
    }
  }

  if (status === 'idle' || !domain) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conectar Domínio Personalizado</CardTitle>
          <CardDescription>
            Use seu próprio domínio para sua aplicação.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="domain">Nome do Domínio</Label>
              <Input
                id="domain"
                placeholder="www.seudominio.com"
                {...form.register('domain')}
              />
              {form.formState.errors.domain && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.domain.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Adicionar Domínio</Button>
          </CardFooter>
        </form>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Domínio Personalizado</CardTitle>
            <CardDescription>
              Gerencie a conexão do seu domínio.
            </CardDescription>
          </div>
          <Button variant="destructive" size="icon" onClick={removeDomain}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{domain}</span>
            {renderStatusBadge()}
          </div>
          {renderSslStatus()}
        </div>

        {status === 'error' && dnsError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {dnsError.type === 'DNS_PROBE_FINISHED_NXDOMAIN'
                ? 'Erro de Resolução DNS'
                : 'Falha na Verificação do Domínio'}
            </AlertTitle>
            <AlertDescription>{dnsError.message}</AlertDescription>
          </Alert>
        )}

        {status === 'active' && sslStatus === 'active' && (
          <Alert
            variant="default"
            className="mt-4 bg-success/10 border-success/50"
          >
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">
              Domínio Conectado e Seguro
            </AlertTitle>
            <AlertDescription>
              Sua aplicação está ativa e segura em{' '}
              <a
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                https://{domain}
              </a>
              .
            </AlertDescription>
          </Alert>
        )}

        {(status === 'pending' || status === 'error') && <DnsInstructions />}
      </CardContent>
      {(status === 'pending' || status === 'error') && (
        <CardFooter>
          <Button onClick={handleVerify} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verificar Configuração
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
