import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link } from 'react-router-dom'
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
import { DollarSign, Loader2, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const requestPasswordReset = useAuthStore(
    (state) => state.requestPasswordReset,
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    try {
      await requestPasswordReset(data.email)
      setIsSubmitted(true)
    } catch (error) {
      // In a real app, you might not want to reveal if an email exists.
      // For this mock, we'll show success regardless to prevent enumeration.
      setIsSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <DollarSign className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Esqueceu a Senha?</CardTitle>
          <CardDescription>
            {isSubmitted
              ? 'Verifique sua caixa de entrada.'
              : 'Insira seu email para receber o link de redefinição.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <Alert variant="default" className="text-center">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Link Enviado!</AlertTitle>
              <AlertDescription>
                Se uma conta com este email existir, um link para redefinir sua
                senha foi enviado.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Link
              </Button>
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            Lembrou a senha?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage
