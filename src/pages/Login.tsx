import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, DollarSign, Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, socialLogin } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      await login(data.email, data.password)
      navigate('/')
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError('Ocorreu um erro inesperado.')
      form.setValue('password', '')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async () => {
    setIsSocialLoading(true)
    setError(null)
    try {
      await socialLogin()
      navigate('/')
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError('Ocorreu um erro inesperado.')
    } finally {
      setIsSocialLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <DollarSign className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro de Login</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        {...field}
                        disabled={isLoading || isSocialLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        disabled={isLoading || isSocialLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isSocialLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
              </Button>
            </form>
          </Form>
          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-xs text-muted-foreground">
              OU
            </span>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSocialLogin}
              disabled={isLoading || isSocialLoading}
            >
              {isSocialLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <img
                  src="https://img.usecurling.com/i?q=google&color=multicolor"
                  alt="Google"
                  className="mr-2 h-4 w-4"
                />
              )}
              Entrar com Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSocialLogin}
              disabled={isLoading || isSocialLoading}
            >
              {isSocialLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <img
                  src="https://img.usecurling.com/i?q=facebook&color=multicolor"
                  alt="Facebook"
                  className="mr-2 h-4 w-4"
                />
              )}
              Entrar com Facebook
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Crie uma agora
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
