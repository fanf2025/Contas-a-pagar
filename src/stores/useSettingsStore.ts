import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SettingsState {
  paymentRemindersEnabled: boolean
  newTransactionImportsEnabled: boolean
  togglePaymentReminders: () => void
  toggleNewTransactionImports: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      paymentRemindersEnabled: true,
      newTransactionImportsEnabled: true,
      togglePaymentReminders: () =>
        set((state) => ({
          paymentRemindersEnabled: !state.paymentRemindersEnabled,
        })),
      toggleNewTransactionImports: () =>
        set((state) => ({
          newTransactionImportsEnabled: !state.newTransactionImportsEnabled,
        })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
