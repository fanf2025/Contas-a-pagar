import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  email: string
  name: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email, password) => {
        // Mock API call
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (email === 'user@example.com' && password === 'password123') {
              set({
                isAuthenticated: true,
                user: { email: 'user@example.com', name: 'John Doe' },
              })
              resolve()
            } else {
              reject(new Error('Email ou senha inválidos'))
            }
          }, 1000)
        })
      },
      logout: () => {
        set({ isAuthenticated: false, user: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
