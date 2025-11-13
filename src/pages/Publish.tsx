import { PublishWizard } from '@/components/PublishWizard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const PublishPage = () => {
  return (
    <div className="page-content">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Publicar Aplicação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PublishWizard />
        </CardContent>
      </Card>
    </div>
  )
}

export default PublishPage
