/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Lancamentos from './pages/Lancamentos'
import Baixas from './pages/Baixas'
import Relatorios from './pages/Relatorios'
import Configuracoes from './pages/Configuracoes'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import ForgotPasswordPage from './pages/ForgotPassword'
import { ProtectedRoute } from './components/ProtectedRoute'
import MetasPage from './pages/Metas'
import ProfilePage from './pages/Profile'
import ResetPasswordPage from './pages/ResetPassword'
import CashEntryDetailPage from './pages/CashEntryDetail'
import PublishPage from './pages/Publish'

// ONLY IMPORT AND RENDER WORKING PAGES, NEVER ADD PLACEHOLDER COMPONENTS OR PAGES IN THIS FILE
// AVOID REMOVING ANY CONTEXT PROVIDERS FROM THIS FILE (e.g. TooltipProvider, Toaster, Sonner)

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/lancamentos" element={<Lancamentos />} />
            <Route
              path="/lancamentos/caixa/:id"
              element={<CashEntryDetailPage />}
            />
            <Route path="/baixas" element={<Baixas />} />
            <Route path="/metas" element={<MetasPage />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/publicar" element={<PublishPage />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
