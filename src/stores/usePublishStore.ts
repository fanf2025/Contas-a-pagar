import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type DomainStatus = 'idle' | 'pending' | 'active' | 'error'
type SslStatus = 'idle' | 'provisioning' | 'active' | 'error'
type DnsError = {
  type: 'DNS_PROBE_FINISHED_NXDOMAIN' | 'INCORRECT_RECORD' | 'UNKNOWN'
  message: string
}
type DnsRecord = {
  type: 'CNAME'
  host: string
  value: string
}

interface PublishState {
  domain: string | null
  status: DomainStatus
  sslStatus: SslStatus
  dnsError: DnsError | null
  requiredDnsRecord: DnsRecord
  setDomain: (domain: string) => void
  verifyDomain: () => Promise<void>
  removeDomain: () => void
}

export const usePublishStore = create<PublishState>()(
  persist(
    (set, get) => ({
      domain: 'www.contasnovaformula.com.br',
      status: 'active',
      sslStatus: 'active',
      dnsError: null,
      requiredDnsRecord: {
        type: 'CNAME',
        host: 'www',
        value: 'publish.contasapagar.app',
      },
      setDomain: (domain: string) => {
        set({ domain, status: 'pending', sslStatus: 'idle', dnsError: null })
      },
      verifyDomain: async () => {
        return new Promise((resolve) => {
          set({ status: 'pending', sslStatus: 'idle', dnsError: null })
          setTimeout(() => {
            const isDomainSuccess = Math.random() > 0.3
            if (isDomainSuccess) {
              set({ status: 'active', sslStatus: 'provisioning' })

              setTimeout(() => {
                const isSslSuccess = Math.random() > 0.2
                if (isSslSuccess) {
                  set({ sslStatus: 'active' })
                } else {
                  set({
                    sslStatus: 'error',
                    dnsError: {
                      type: 'UNKNOWN',
                      message: 'Falha ao provisionar o certificado SSL.',
                    },
                  })
                }
                resolve()
              }, 3000)
            } else {
              set({
                status: 'error',
                sslStatus: 'idle',
                dnsError: {
                  type: 'DNS_PROBE_FINISHED_NXDOMAIN',
                  message:
                    'Não foi possível encontrar o registro DNS. Verifique se o registro CNAME foi configurado corretamente em seu provedor de domínio.',
                },
              })
              resolve()
            }
          }, 2500)
        })
      },
      removeDomain: () => {
        set({
          domain: null,
          status: 'idle',
          sslStatus: 'idle',
          dnsError: null,
        })
      },
    }),
    {
      name: 'publish-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
