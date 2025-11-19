import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
  Download,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  WifiOff,
} from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const InstallationGuidePage = () => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const installerUrl =
    'https://github.com/skip-me/contas-a-pagar/releases/latest/download/contas-a-pagar_1.0.0_x64-setup.msi'
  const releasesUrl =
    'https://github.com/skip-me/contas-a-pagar/releases/latest'

  const handleDownload = async () => {
    setDownloadError(null)
    setIsDownloading(true)

    // Check for network connectivity first
    if (!navigator.onLine) {
      setDownloadError(
        'Sem conexão com a internet. Verifique sua rede e tente novamente.',
      )
      setIsDownloading(false)
      return
    }

    try {
      // We use a direct link trigger to let the browser handle the download stream.
      // This avoids CORS issues and memory limits associated with fetch/blob for large files.
      const link = document.createElement('a')
      link.href = installerUrl
      link.setAttribute('download', 'contas-a-pagar_setup.msi')
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noopener noreferrer')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Download iniciado!', {
        description: 'O instalador está sendo baixado pelo seu navegador.',
        duration: 5000,
      })
    } catch (error) {
      console.error('Erro ao iniciar download:', error)
      setDownloadError(
        'Não foi possível iniciar o download automaticamente. Por favor, tente o link alternativo abaixo.',
      )
    } finally {
      // Reset loading state after a short delay to prevent double clicks
      setTimeout(() => setIsDownloading(false), 2000)
    }
  }

  return (
    <div className="page-content space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Guia de Instalação para PC
          </CardTitle>
          <CardDescription>
            Siga os passos abaixo para instalar o Contas a Pagar no seu
            computador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-6 bg-secondary/10 border border-secondary/20 rounded-lg space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Download do Instalador
                </h3>
                <p className="text-muted-foreground">
                  Clique no botão abaixo para baixar a versão mais recente e
                  oficial do instalador para Windows.
                </p>
              </div>

              {downloadError && (
                <Alert variant="destructive" className="animate-fade-in">
                  <WifiOff className="h-4 w-4" />
                  <AlertTitle>Erro no Download</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2">
                    <p>{downloadError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit mt-2 border-destructive/50 hover:bg-destructive/10"
                      onClick={() => window.open(releasesUrl, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Acessar Página de Downloads
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full sm:w-auto"
                >
                  {isDownloading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {isDownloading
                    ? 'Iniciando...'
                    : 'Baixar Instalador para Windows'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <a
                    href={releasesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Outras Versões
                  </a>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Versão 1.0.0 (x64) • Tamanho aprox. 5MB • Servidor Seguro
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Requisitos do Sistema
              </h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Componente</TableHead>
                      <TableHead>Mínimo</TableHead>
                      <TableHead>Recomendado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Sistema Operacional
                      </TableCell>
                      <TableCell>Windows 10 (64-bit)</TableCell>
                      <TableCell>Windows 11 (64-bit)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Processador</TableCell>
                      <TableCell>Intel Core i3 ou equivalente</TableCell>
                      <TableCell>Intel Core i5 ou equivalente</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Memória RAM</TableCell>
                      <TableCell>4 GB</TableCell>
                      <TableCell>8 GB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Espaço em Disco
                      </TableCell>
                      <TableCell>500 MB livres</TableCell>
                      <TableCell>1 GB livre em SSD</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Passos para Instalação
              </h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Passo 1: Execute o Instalador
                  </AccordionTrigger>
                  <AccordionContent>
                    Após o download, localize o arquivo{' '}
                    <code className="bg-muted px-1 py-0.5 rounded">
                      contas-a-pagar_1.0.0_x64-setup.msi
                    </code>{' '}
                    e dê um duplo clique para executá-lo. O Windows pode exibir
                    um aviso de segurança; clique em "Mais informações" e depois
                    em "Executar mesmo assim".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Passo 2: Siga as Instruções
                  </AccordionTrigger>
                  <AccordionContent>
                    O assistente de instalação será iniciado. Siga as instruções
                    na tela, aceitando os termos de uso e escolhendo o local de
                    instalação (recomendamos manter o padrão).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Passo 3: Conclua a Instalação
                  </AccordionTrigger>
                  <AccordionContent>
                    Aguarde o processo de cópia dos arquivos ser concluído. Ao
                    final, clique em "Concluir". Um atalho para o "Contas a
                    Pagar" será criado na sua área de trabalho.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Passo 4: Inicie a Aplicação
                  </AccordionTrigger>
                  <AccordionContent>
                    Dê um duplo clique no atalho criado na área de trabalho para
                    iniciar a aplicação. Na primeira vez, pode levar alguns
                    segundos a mais para carregar. Faça login com sua conta para
                    começar a usar.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="space-y-4">
              <div className="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Instalação Concluída!</h4>
                  <p className="text-sm text-muted-foreground">
                    Se você seguiu todos os passos, o programa está pronto para
                    uso. Aproveite a organização financeira que o Contas a Pagar
                    oferece!
                  </p>
                </div>
              </div>
              <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-warning mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Problemas na Instalação?</h4>
                  <p className="text-sm text-muted-foreground">
                    Se encontrar algum problema, tente desativar temporariamente
                    seu antivírus e executar o instalador como administrador
                    (clique com o botão direito e "Executar como
                    administrador").
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InstallationGuidePage
