import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// This type is for external use, representing the full user object
export interface UserProfile {
  email: string
  name: string
  avatar?: string
}

// This type is for internal store state, without the large avatar data
interface UserInState {
  email: string
  name: string
}

// This type is for the mock database, which includes the password
interface UserInDb extends UserInState {
  password?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: UserInState | null
  users: UserInDb[] // To simulate a user database
  login: (email: string, password: string) => Promise<void>
  socialLogin: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (name: string, email: string) => Promise<void> // Avatar logic removed
  requestPasswordReset: (email: string) => Promise<void>
}

// Initial mock user in DB. Avatar is handled separately.
const initialUsers: UserInDb[] = [
  {
    email: 'user@example.com',
    name: 'John Doe',
    password: 'password123',
  },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      users: initialUsers,
      login: async (email, password) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const userInDb = get().users.find(
              (u) => u.email === email && u.password === password,
            )
            if (userInDb) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { password, ...userToStore } = userInDb
              set({
                isAuthenticated: true,
                user: userToStore,
              })
              resolve()
            } else {
              reject(new Error('Email ou senha inválidos'))
            }
          }, 1000)
        })
      },
      socialLogin: async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const userInDb = get().users[0]
            if (userInDb) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { password, ...userToStore } = userInDb
              set({
                isAuthenticated: true,
                user: userToStore,
              })
            }
            resolve()
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
              const newUser: UserInDb = { name, email, password }
              set({ users: [...users, newUser] })
              resolve()
            }
          }, 1000)
        })
      },
      logout: () => {
        set({ isAuthenticated: false, user: null })
      },
      updateUser: async (name, email) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const { user, users } = get()
            if (!user) {
              return reject(new Error('Usuário não autenticado.'))
            }
            const otherUserExists = users.some(
              (u) => u.email === email && u.email !== user.email,
            )
            if (otherUserExists) {
              return reject(new Error('Este email já está em uso.'))
            }

            const updatedUser: UserInState = {
              name,
              email,
            }
            const updatedUsers = users.map((u) =>
              u.email === user.email ? { ...u, name, email } : u,
            )
            set({ user: updatedUser, users: updatedUsers })
            resolve()
          }, 500)
        })
      },
      requestPasswordReset: async (email: string) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const userExists = get().users.some((u) => u.email === email)
            if (userExists) {
              console.log(`Password reset link sent to ${email}`)
              resolve()
            } else {
              reject(new Error('Nenhuma conta encontrada com este email.'))
            }
          }, 1000)
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
