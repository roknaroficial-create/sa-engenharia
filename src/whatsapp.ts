import { siteConfig } from './config'

export type AnalyticsEvent = 'cta_click' | 'whatsapp_open'

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

/**
 * Mantém os mesmos nomes de evento do site anterior (`cta_click` e `whatsapp_open`),
 * porque gatilhos do Google Tag Manager / Google Ads podem depender deles.
 */
export function trackEvent(event: AnalyticsEvent, details: Record<string, unknown> = {}) {
  window.dataLayer?.push({ event, ...details })
  window.dispatchEvent(new CustomEvent('sa:analytics', { detail: { event, ...details } }))
}

export const hasWhatsapp = /^\d{10,15}$/.test(siteConfig.whatsappNumber)

export function whatsappUrl(message: string = siteConfig.defaultWhatsappMessage) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}
