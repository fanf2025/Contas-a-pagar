import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAnalyticsStore } from '@/stores/useAnalyticsStore'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer: any[]
  }
}

export const AnalyticsTracker = () => {
  const location = useLocation()
  const { gaMeasurementId, isAnalyticsEnabled } = useAnalyticsStore()

  useEffect(() => {
    if (!isAnalyticsEnabled || !gaMeasurementId) {
      return
    }

    const scriptId = 'ga-tracking-script'
    if (document.getElementById(scriptId)) {
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`
    script.async = true
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', gaMeasurementId, {
      page_path: location.pathname + location.search,
    })

    return () => {
      const existingScript = document.getElementById(scriptId)
      if (existingScript) {
        existingScript.remove()
      }
      delete window.gtag
    }
  }, [isAnalyticsEnabled, gaMeasurementId, location.pathname, location.search])

  useEffect(() => {
    if (
      isAnalyticsEnabled &&
      gaMeasurementId &&
      typeof window.gtag === 'function'
    ) {
      window.gtag('config', gaMeasurementId, {
        page_path: location.pathname + location.search,
      })
    }
  }, [location, isAnalyticsEnabled, gaMeasurementId])

  return null
}
