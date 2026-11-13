import type { ReactNode } from 'react'
import { hasWhatsapp, trackEvent, whatsappUrl, type AnalyticsEvent } from '../whatsapp'

type WhatsAppLinkProps = {
  /** Onde o botão está na página — vai junto no evento de analytics. */
  location: string
  /** Mensagem que já aparece escrita no WhatsApp do visitante. */
  message?: string
  /** Serviço de interesse, enviado junto no evento. */
  service?: string
  /**
   * Evento disparado no clique. O padrão é `whatsapp_open`; o botão principal do topo
   * continua mandando só `cta_click`, como no site anterior, para não contar conversão em dobro.
   */
  event?: AnalyticsEvent
  label?: string
  className?: string
  ariaLabel?: string
  onClick?: () => void
  children: ReactNode
}

export function WhatsAppLink({ location, message, service, event = 'whatsapp_open', label, className, ariaLabel, onClick, children }: WhatsAppLinkProps) {
  if (!hasWhatsapp) {
    return (
      <a className={className} href="#contato" onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <a
      className={className}
      href={whatsappUrl(message)}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      onClick={() => {
        trackEvent(event, { location, ...(label ? { label } : {}), ...(service ? { service } : {}) })
        onClick?.()
      }}
    >
      {children}
    </a>
  )
}
