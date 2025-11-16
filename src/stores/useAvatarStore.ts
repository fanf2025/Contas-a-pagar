import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AvatarState {
  avatars: Record<string, string> // key: user email, value: base64 avatar string
  setAvatar: (email: string, avatar: string) => void
  getAvatar: (email: string) => string | undefined
}

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set, get) => ({
      avatars: {
        'user@example.com':
          'https://img.usecurling.com/ppl/medium?gender=male&seed=1',
      },
      setAvatar: (email, avatar) => {
        set((state) => ({
          avatars: {
            ...state.avatars,
            [email]: avatar,
          },
        }))
      },
      getAvatar: (email) => {
        return get().avatars[email]
      },
    }),
    {
      name: 'avatar-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
