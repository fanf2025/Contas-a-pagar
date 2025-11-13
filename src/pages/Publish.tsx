import { PublishWizard } from '@/components/PublishWizard'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { CustomDomainManager } from '@/components/CustomDomainManager'
import { Separator } from '@/components/ui/separator'

const PublishPage = () => {
  return (
    <div className="page-content space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Publicar Aplicação
          </CardTitle>
          <CardDescription>
            Siga os passos para colocar sua aplicação no ar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PublishWizard />
        </CardContent>
      </Card>

      <Separator />

      <CustomDomainManager />
    </div>
  )
}

export default PublishPage
