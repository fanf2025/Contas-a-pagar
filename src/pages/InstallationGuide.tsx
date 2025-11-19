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
} from 'lucide-react'
import { toast } from 'sonner'

const InstallationGuidePage = () => {
  const releasesUrl =
    'https://github.com/skip-me/contas-a-pagar/releases/latest'

  const handleDownload = () => {
    window.open(releasesUrl, '_blank')
    toast.success('Redirecionando para o GitHub...', {
      description:
        'Você pode baixar a versão mais recente na página de lançamentos.',
    })
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
                  Clique no botão abaixo para acessar a página de downloads
                  oficial no GitHub e baixar a versão mais recente do instalador
                  para Windows (arquivo .msi).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={handleDownload}
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Acessar Página de Downloads
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
                    Ver Todas as Versões
                  </a>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Versão Atual: 0.0.50 • Servidor Seguro
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
                    Passo 1: Baixe o Instalador
                  </AccordionTrigger>
                  <AccordionContent>
                    Na página do GitHub, localize a seção "Assets" da versão
                    mais recente e clique no arquivo com extensão{' '}
                    <code>.msi</code> (ex:{' '}
                    <code>contas-a-pagar_0.0.50_x64-setup.msi</code>) para
                    iniciar o download.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Passo 2: Execute o Arquivo
                  </AccordionTrigger>
                  <AccordionContent>
                    Após o download, localize o arquivo baixado e dê um duplo
                    clique para executá-lo. O Windows pode exibir um aviso de
                    segurança; clique em "Mais informações" e depois em
                    "Executar mesmo assim".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Passo 3: Siga as Instruções
                  </AccordionTrigger>
                  <AccordionContent>
                    O assistente de instalação será iniciado. Siga as instruções
                    na tela, aceitando os termos de uso e escolhendo o local de
                    instalação.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Passo 4: Conclua a Instalação
                  </AccordionTrigger>
                  <AccordionContent>
                    Aguarde o processo de cópia dos arquivos ser concluído. Ao
                    final, clique em "Concluir". Um atalho para o "Contas a
                    Pagar" será criado na sua área de trabalho.
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
