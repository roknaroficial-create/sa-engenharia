import { siteConfig } from '../config'
import { trackEvent } from '../whatsapp'
import { ArrowRight, ArrowUpRight } from './Icons'
import { WhatsAppLink } from './WhatsAppLink'

/* Ilustra o que a vistoria entrega. É um exemplo, não um laudo real. */
const reportExample = [
  { item: 'Pisos e revestimentos', ok: true },
  { item: 'Instalações elétricas', ok: true },
  { item: 'Portas e janelas', ok: false },
  { item: 'Infiltração no banheiro', ok: false },
  { item: 'Pintura e acabamento', ok: true },
]

export function Hero() {
  const { hero } = siteConfig.images

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <img
        className="hero__bg"
        src={hero.src}
        width={hero.width}
        height={hero.height}
        alt={hero.alt}
        fetchPriority="high"
      />
      <div className="hero__shade" aria-hidden="true" />

      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="label label--light">Engenharia com atendimento presencial</p>
          <h1 className="hero__title display" id="hero-title">
            Vistoria de imóveis e gerenciamento de obras.
            <span>Do laudo à obra pronta.</span>
          </h1>
          <p className="hero__lead">
            Conferimos o imóvel antes de você receber as chaves, comprar ou alugar. E cuidamos da sua obra do começo ao fim,
            com controle de prazo, custo e qualidade.
          </p>

          <WhatsAppLink className="btn btn--accent btn--lg hero__cta" location="hero" label="Pedir orçamento no WhatsApp">
            Pedir orçamento no WhatsApp <ArrowUpRight />
          </WhatsAppLink>

          <div className="hero__paths" aria-label="Serviços principais">
            <a href="#vistorias" onClick={() => trackEvent('cta_click', { location: 'hero', label: 'Vistorias e laudos' })}>
              <span>01</span> Vistorias e laudos <ArrowRight size={18} />
            </a>
            <a href="#gerenciamento" onClick={() => trackEvent('cta_click', { location: 'hero', label: 'Gerenciamento de obras' })}>
              <span>02</span> Gerenciamento de obras <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <aside className="report" aria-label="Exemplo do que um laudo de vistoria mostra">
          <header className="report__head">
            <span>Laudo de vistoria</span>
            <span>Exemplo</span>
          </header>
          <p className="report__title">Apartamento novo · entrega de chaves</p>
          <ul className="report__list">
            {reportExample.map((row) => (
              <li className={`report__row${row.ok ? '' : ' report__row--fix'}`} key={row.item}>
                <span>{row.item}</span>
                <strong>{row.ok ? 'Conforme' : 'Corrigir'}</strong>
              </li>
            ))}
          </ul>
          <p className="report__foot">O laudo mostra o que está certo e o que precisa ser corrigido.</p>
        </aside>
      </div>

      <div className="hero__facts">
        <dl className="wrap hero__facts-grid">
          <div><dt>{siteConfig.yearsInBusiness} anos</dt><dd>de atuação</dd></div>
          <div><dt>Presencial</dt><dd>a equipe vai até o local</dd></div>
          <div><dt>Laudo técnico</dt><dd>de engenharia</dd></div>
          <div><dt>SP e Uberaba/MG</dt><dd>capital e Grande São Paulo</dd></div>
        </dl>
      </div>
    </section>
  )
}
