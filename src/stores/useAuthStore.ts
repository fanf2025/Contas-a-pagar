import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  email: string
  name: string
  password?: string // Keep password for mock registration
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  users: User[] // To simulate a user database
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      users: [
        {
          email: 'user@example.com',
          name: 'John Doe',
          password: 'password123',
        },
      ],
      login: async (email, password) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const user = get().users.find(
              (u) => u.email === email && u.password === password,
            )
            if (user) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { password, ...userWithoutPassword } = user
              set({
                isAuthenticated: true,
                user: userWithoutPassword,
              })
              resolve()
            } else {
              reject(new Error('Email ou senha inválidos'))
            }
          }, 1000)
        })
      },
      register: async (name, email, password) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const { users } = get()
            const userExists = users.some((u) => u.email === email)

            if (userExists) {
              reject(new Error('Este email já está em uso.'))
            } else {
              const newUser = { name, email, password }
              set({ users: [...users, newUser] })
              resolve()
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
