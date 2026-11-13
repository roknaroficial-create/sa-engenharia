import { siteConfig } from '../config'
import { trackEvent } from '../whatsapp'
import { ArrowRight, ArrowUpRight, MapPin } from './Icons'
import { WhatsAppLink } from './WhatsAppLink'

export function ReferenceHero() {
  const regions = siteConfig.regions.join(', ')

  return (
    <section className="reference-hero" id="inicio" aria-labelledby="reference-hero-title">
      <img
        className="reference-hero__image"
        src={siteConfig.images.hero.src}
        width={siteConfig.images.hero.width}
        height={siteConfig.images.hero.height}
        alt={siteConfig.images.hero.alt}
        fetchPriority="high"
      />
      <div className="reference-hero__overlay" aria-hidden="true" />

      <div className="reference-hero__inner">
        <div className="reference-hero__content">
          <p className="reference-hero__eyebrow">
            <span aria-hidden="true">—</span> Engenharia com atendimento presencial
          </p>

          <h1 className="reference-hero__title" id="reference-hero-title">
            Vistoria de imóveis e gerenciamento de obras.{' '}
            <span>Do laudo à obra pronta.</span>
          </h1>

          <p className="reference-hero__lead">
            Conferimos o imóvel antes de você receber as chaves, comprar ou alugar. E cuidamos da sua obra do começo ao fim, com controle de prazo, custo e qualidade.
          </p>

          <div className="hero-pillars" aria-label="Serviços principais">
            <a href="#vistorias" onClick={() => trackEvent('cta_click', { location: 'hero', label: 'Vistorias e laudos' })}>
              <span>01</span>
              <strong>Vistorias e laudos</strong>
              <ArrowRight size={18} />
            </a>
            <a href="#gerenciamento" onClick={() => trackEvent('cta_click', { location: 'hero', label: 'Gerenciamento de obras' })}>
              <span>02</span>
              <strong>Gerenciamento de obras</strong>
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="reference-hero__actions">
            <WhatsAppLink
              className="reference-hero__cta reference-hero__cta--primary"
              location="hero"
              label="Pedir orçamento no WhatsApp"
            >
              Pedir orçamento no WhatsApp
              <ArrowUpRight className="reference-hero__cta-icon" />
            </WhatsAppLink>
          </div>

          <p className="hero-regions">
            <MapPin size={18} />
            <span>Atendimento presencial em {regions}.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
