import { Button } from '@/components/ui/button'

const BaixasPage = () => {
  // This is a placeholder. The full implementation will be provided in the next steps.
  return (
    <div className="page-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Baixas de Pagamentos</h2>
      </div>
      {/* Filters and List of pending payments will be implemented here */}
      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-center text-muted-foreground">
          Nenhuma despesa em aberto no momento. Tudo pago!
        </p>
      </div>
    </div>
  )
}

export default BaixasPage
