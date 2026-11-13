import { useEffect, useState } from 'react'
import { siteConfig } from './config'
import { pad } from './format'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ArrowRight, ArrowUpRight, MapPin, Plus, WhatsAppIcon } from './components/Icons'
import { Lightbox, type Photo } from './components/Lightbox'
import { WhatsAppLink } from './components/WhatsAppLink'
import { hasWhatsapp } from './whatsapp'

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px' },
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])
}

function SectionHead({ id, label, title, text, light = false }: { id: string; label: string; title: string; text?: string; light?: boolean }) {
  return (
    <div className={`section-head${light ? ' section-head--light' : ''}`} data-reveal>
      <p className={`label${light ? ' label--light' : ''}`}>{label}</p>
      <div>
        <h2 className="display" id={id}>{title}</h2>
        {text && <p>{text}</p>}
      </div>
    </div>
  )
}

/* Faixa amarela com os serviços, estilo fita de obra */
const tickerItems = [
  'Vistoria de imóvel novo',
  'Imóvel usado',
  'Laudos técnicos',
  'Gerenciamento de obras',
  'Reformas',
  'Projetos em AutoCAD e 3D',
  'São Paulo',
  'Grande São Paulo',
  'Uberaba/MG',
]

function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[0, 1].map((group) => (
          <div className="ticker__group" key={group}>
            {tickerItems.map((item) => <span className="ticker__item" key={item}>{item}</span>)}
          </div>
        ))}
      </div>
    </div>
  )
}

/* 1. Os dois serviços principais */
function Services() {
  return (
    <section className="section services" id="servicos" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHead
          id="services-title"
          label="Serviços"
          title="Dois serviços principais. Uma mesma equipe."
          text="A vistoria confere o imóvel. O gerenciamento cuida da obra. E um costuma levar ao outro."
        />

        <div className="pillars">
          {siteConfig.pillars.map((pillar) => (
            <article className="pillar" key={pillar.id} data-reveal>
              <figure className="pillar__media">
                <img src={pillar.image.src} width={pillar.image.width} height={pillar.image.height} alt={pillar.image.alt} loading="lazy" />
                <span className="pillar__num">{pillar.number}</span>
              </figure>
              <div className="pillar__body">
                <h3 className="display">{pillar.title}</h3>
                <p className="pillar__for">{pillar.forWho}</p>
                <p className="pillar__text">{pillar.description}</p>
                <ul className="ticks">
                  {pillar.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div className="pillar__actions">
                  <WhatsAppLink className="btn btn--ink" location={`pillar_${pillar.id}`} service={pillar.title} message={pillar.message}>
                    {pillar.cta} <ArrowUpRight size={18} />
                  </WhatsAppLink>
                  <a className="link-arrow" href={`#${pillar.id}`}>Saiba mais <ArrowRight size={16} /></a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="bridge" data-reveal>
          <div className="bridge__flow" aria-hidden="true">
            <span>Vistoria</span><i /><span>Obra</span>
          </div>
          <div>
            <h3 className="display">Uma coisa leva à outra.</h3>
            <p>
              Fez a vistoria do apartamento novo e quer reformar? A mesma equipe que já conhece o seu imóvel pode gerenciar a obra,
              do primeiro dia até a entrega.
            </p>
          </div>
          <WhatsAppLink
            className="btn btn--accent"
            location="bridge"
            service="Vistoria e gerenciamento"
            message="Olá! Vim pelo site e quero fazer a vistoria do imóvel e depois o gerenciamento da obra."
          >
            Quero os dois <ArrowUpRight size={18} />
          </WhatsAppLink>
        </div>
      </div>
    </section>
  )
}

/* 2. Tipos de vistoria, em formato de ficha técnica */
function Inspections() {
  const photo = siteConfig.images.fieldPhotos[2]

  return (
    <section className="section inspections" id="vistorias" aria-labelledby="inspections-title">
      <div className="wrap inspections__grid">
        <div className="inspections__aside" data-reveal>
          <p className="label">Vistorias e laudos</p>
          <h2 className="display" id="inspections-title">A vistoria certa para cada situação.</h2>
          <p className="inspections__lead">
            Imóvel novo, usado, de empresa ou para banco e prefeitura: a equipe vai até o local e entrega um laudo técnico de engenharia.
          </p>
          <figure className="inspections__photo">
            <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" />
          </figure>
        </div>

        <ol className="spec-list">
          {siteConfig.inspectionTypes.map((type, index) => (
            <li className="spec" key={type.title} data-reveal>
              <span className="spec__code">V/{pad(index + 1)}</span>
              <div>
                <span className="spec__tag">{type.tag}</span>
                <h3 className="display">{type.title}</h3>
                <p>{type.text}</p>
                <WhatsAppLink className="link-arrow" location="inspection_card" service={type.title} message={type.message}>
                  Pedir orçamento <ArrowUpRight size={16} />
                </WhatsAppLink>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* 3. Gerenciamento de obras */
function ControlDiagram() {
  return (
    <div className="control" data-reveal aria-hidden="true">
      <svg viewBox="0 0 420 370">
        <polygon className="control__outer" points="210,30 390,340 30,340" />
        <polygon className="control__inner" points="210,130 305,295 115,295" />
        <line className="control__inner" x1="210" y1="30" x2="210" y2="198" />
        <line className="control__inner" x1="390" y1="340" x2="252" y2="262" />
        <line className="control__inner" x1="30" y1="340" x2="168" y2="262" />
        <circle className="control__core" cx="210" cy="240" r="52" />
        <text className="control__core-text" x="210" y="236">S.A</text>
        <text className="control__core-sub" x="210" y="258">SUA OBRA</text>
      </svg>
      <span className="control__tag control__tag--top">01 Prazo</span>
      <span className="control__tag control__tag--right">02 Custo</span>
      <span className="control__tag control__tag--left">03 Qualidade</span>
    </div>
  )
}

function Management() {
  return (
    <section className="section management" id="gerenciamento" aria-labelledby="management-title">
      <div className="wrap">
        <div className="management__top">
          <div data-reveal>
            <p className="label label--light">Gerenciamento de obras</p>
            <h2 className="display" id="management-title">Sua obra cuidada <em>como se fosse nossa.</em></h2>
            <p className="management__lead">
              Para obra nova, reforma, prédio ou loja. Você contrata, a gente acompanha tudo de perto e você só se preocupa em receber a obra pronta.
            </p>
            <WhatsAppLink
              className="btn btn--accent btn--lg"
              location="management"
              service="Gerenciamento de obras"
              message="Olá! Vim pelo site e quero um orçamento de gerenciamento de obra."
            >
              Quero gerenciar minha obra <ArrowUpRight />
            </WhatsAppLink>
          </div>
          <ControlDiagram />
        </div>

        <ul className="scope">
          {siteConfig.managementScope.map((item, index) => (
            <li key={item.title} data-reveal>
              <span className="scope__num">G/{pad(index + 1)}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* 4. Passo a passo, com abas por serviço */
const howTabs = {
  inspection: {
    label: 'Vistoria e laudo',
    steps: siteConfig.steps.inspection,
    cta: 'Pedir uma vistoria',
    service: 'Vistorias e laudos',
    message: 'Olá! Vim pelo site e quero um orçamento de vistoria de imóvel.',
  },
  management: {
    label: 'Gerenciamento de obra',
    steps: siteConfig.steps.management,
    cta: 'Pedir gerenciamento',
    service: 'Gerenciamento de obras',
    message: 'Olá! Vim pelo site e quero um orçamento de gerenciamento de obra.',
  },
} as const

type HowTab = keyof typeof howTabs

function HowItWorks() {
  const [tab, setTab] = useState<HowTab>('inspection')
  const active = howTabs[tab]

  return (
    <section className="section how" id="como-funciona" aria-labelledby="how-title">
      <div className="wrap">
        <SectionHead
          id="how-title"
          label="Como funciona"
          title="Simples, do primeiro contato à entrega."
          text="Sem complicação: veja o passo a passo de cada serviço."
        />

        <div className="tabs" role="tablist" aria-label="Escolha o serviço">
          {(Object.keys(howTabs) as HowTab[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`how-tab-${key}`}
              aria-selected={tab === key}
              aria-controls="how-panel"
              onClick={() => setTab(key)}
            >
              {howTabs[key].label}
            </button>
          ))}
        </div>

        <div className="how__panel" id="how-panel" role="tabpanel" aria-labelledby={`how-tab-${tab}`}>
          <ol className="timeline" key={tab}>
            {active.steps.map((step, index) => (
              <li key={step.title}>
                <span className="timeline__num" aria-hidden="true">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <WhatsAppLink className="btn btn--ink btn--lg how__cta" location="how_it_works" service={active.service} message={active.message}>
            {active.cta} <ArrowUpRight />
          </WhatsAppLink>
        </div>
      </div>
    </section>
  )
}

/* 5. Fotos reais de obra e vistoria + ambientes entregues */
type PortfolioFilter = 'todas' | 'campo' | 'entregues'
type PortfolioPhoto = Photo & { group: Exclude<PortfolioFilter, 'todas'> }

const portfolioPhotos: PortfolioPhoto[] = (() => {
  const field = siteConfig.images.fieldPhotos.map((photo) => ({ ...photo, group: 'campo' as const }))
  const delivered = siteConfig.images.gallery.map((photo) => ({ ...photo, group: 'entregues' as const }))
  const mixed: PortfolioPhoto[] = []
  for (let index = 0; index < Math.max(field.length, delivered.length); index += 1) {
    if (delivered[index]) mixed.push(delivered[index])
    if (field[index]) mixed.push(field[index])
  }
  return mixed
})()

const portfolioFilters: { key: PortfolioFilter; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'campo', label: 'Obras e vistorias' },
  { key: 'entregues', label: 'Ambientes entregues' },
]

function Portfolio() {
  const [filter, setFilter] = useState<PortfolioFilter>('todas')
  const [open, setOpen] = useState<number | null>(null)
  const photos = filter === 'todas' ? portfolioPhotos : portfolioPhotos.filter((photo) => photo.group === filter)
  // Grade de 4 colunas: a 1ª foto é grande (2x2) e as seguintes ficam altas (1x2) só o suficiente para não sobrar buraco.
  const tallCount = (4 - ((photos.length + 3) % 4)) % 4
  const tallIndexes = Array.from({ length: tallCount }, (_, offset) => offset + 1)

  return (
    <section className="section portfolio" id="galeria" aria-labelledby="portfolio-title">
      <div className="wrap">
        <SectionHead
          id="portfolio-title"
          label="Obras"
          title="Na obra e no imóvel, de perto."
          text="Registros de obras e vistorias acompanhadas pela equipe da S.A Engenharia e ambientes entregues. Toque na foto para ampliar."
        />

        <div className="filters" role="group" aria-label="Filtrar fotos">
          {portfolioFilters.map((item) => (
            <button key={item.key} type="button" aria-pressed={filter === item.key} onClick={() => setFilter(item.key)}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="bento">
          {photos.map((photo, index) => (
            <button
              className={`bento__item${index === 0 ? ' bento__item--big' : ''}${tallIndexes.includes(index) ? ' bento__item--tall' : ''}`}
              type="button"
              key={photo.src}
              onClick={() => setOpen(index)}
              aria-label={`Ampliar foto: ${photo.label}`}
            >
              <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" />
              <span className="bento__cap">
                <span>{photo.category}</span>
                <strong>{photo.label}</strong>
              </span>
            </button>
          ))}
        </div>
      </div>

      {open !== null && <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} onChange={setOpen} />}
    </section>
  )
}

/* 6. Projetos (AutoCAD e 3D) e consultoria */
type ProjectTab = 'autocad' | '3d'

function Projects() {
  const [tab, setTab] = useState<ProjectTab>('autocad')
  const [open, setOpen] = useState<number | null>(null)
  const photos = tab === 'autocad' ? siteConfig.images.autocadProjects : siteConfig.images.technicalProjects

  return (
    <section className="section projects" id="projetos" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead light id="projects-title" label="Também fazemos" title="Projetos e consultoria." />

        <div className="offers">
          {siteConfig.otherServices.map((service, index) => (
            <article className="offer" key={service.title} data-reveal>
              <span className="offer__num">P/{pad(index + 1)}</span>
              <h3 className="display">{service.title}</h3>
              <p>{service.text}</p>
              <WhatsAppLink className="link-arrow link-arrow--light" location="other_services" service={service.title} message={service.message}>
                Pedir orçamento <ArrowUpRight size={16} />
              </WhatsAppLink>
            </article>
          ))}
        </div>

        <div className="projects__bar">
          <div className="tabs tabs--dark" role="tablist" aria-label="Tipo de projeto">
            <button type="button" role="tab" id="project-tab-autocad" aria-selected={tab === 'autocad'} aria-controls="project-panel" onClick={() => setTab('autocad')}>
              Projetos em AutoCAD
            </button>
            <button type="button" role="tab" id="project-tab-3d" aria-selected={tab === '3d'} aria-controls="project-panel" onClick={() => setTab('3d')}>
              Visualização 3D
            </button>
          </div>
          <p className="projects__intro">
            {tab === 'autocad' ? 'Projetos técnicos detalhados para executar sem improviso.' : 'Veja o espaço pronto antes de começar a obra.'}
          </p>
        </div>

        <div className="shots" id="project-panel" role="tabpanel" aria-labelledby={`project-tab-${tab}`}>
          {photos.map((photo, index) => (
            <button
              className={`shot${tab === 'autocad' ? ' shot--plan' : ''}`}
              type="button"
              key={photo.src}
              onClick={() => setOpen(index)}
              aria-label={`Ampliar projeto: ${photo.label}`}
            >
              <span className="shot__media">
                <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" />
              </span>
              <span className="shot__cap">
                <span>{photo.category}</span>
                <strong>{photo.label}</strong>
                <small>{photo.description}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      {open !== null && <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} onChange={setOpen} />}
    </section>
  )
}

/* 7. Para quem é */
function Audiences() {
  return (
    <section className="section audiences" aria-labelledby="audiences-title">
      <div className="wrap">
        <SectionHead
          id="audiences-title"
          label="Para quem é"
          title="Para quem tem um imóvel ou uma obra pela frente."
          text="Pessoas, imobiliárias e empresas: cada um com a sua necessidade."
        />
        <div className="audience-grid">
          {siteConfig.audiences.map((audience, index) => (
            <article className="audience" key={audience.name} data-reveal>
              <span>{pad(index + 1)}</span>
              <h3>{audience.name}</h3>
              <p>{audience.need}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* 8. Sobre + onde atendemos */
function About() {
  const photo = siteConfig.images.gallery[2]

  return (
    <section className="section about" id="sobre" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <figure className="about__photo" data-reveal>
          <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" />
          <figcaption className="about__badge">
            <strong className="display">{siteConfig.yearsInBusiness} anos</strong>
            <span>de atuação</span>
          </figcaption>
        </figure>

        <div className="about__copy" data-reveal>
          <p className="label">Sobre a S.A Engenharia</p>
          <h2 className="display" id="about-title">Uma equipe de engenharia que começou nas vistorias.</h2>
          <p className="about__lead">
            A S.A Engenharia atua há <strong>{siteConfig.yearsInBusiness} anos.</strong> Começou com vistorias e projetos e hoje também gerencia obras do início ao fim.
          </p>
          <p>
            Trabalhamos em equipe, com atendimento presencial e atenção a cada detalhe: da conferência de um imóvel novo ao acompanhamento de uma obra inteira.
          </p>

          <p className="about__values-label">O que guia nosso trabalho</p>
          <ul className="values">
            {siteConfig.values.map((value, index) => (
              <li key={value}><span>{pad(index + 1)}</span>{value}</li>
            ))}
          </ul>

          <div className="regions" id="atendimento">
            <p className="regions__title">
              <strong>Atendimento presencial.</strong> A equipe vai até o seu imóvel ou a sua obra.
            </p>
            <ul>
              {siteConfig.regions.map((region) => (
                <li key={region}><MapPin size={18} /> {region}</li>
              ))}
            </ul>
            <WhatsAppLink className="link-arrow" location="regions">
              Pedir orçamento <ArrowUpRight size={16} />
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 9. Dúvidas */
function FAQ() {
  return (
    <section className="section faq" id="duvidas" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <div className="faq__aside" data-reveal>
          <p className="label">Dúvidas frequentes</p>
          <h2 className="display" id="faq-title">Perguntas que todo mundo faz.</h2>
          <p>Não achou sua dúvida? Pergunte direto no WhatsApp.</p>
          <WhatsAppLink className="btn btn--ink" location="faq">
            Perguntar no WhatsApp <ArrowUpRight size={18} />
          </WhatsAppLink>
        </div>
        <div className="faq__list">
          {siteConfig.faqs.map((faq, index) => (
            <details key={faq.question}>
              <summary>
                <span className="faq__num">{pad(index + 1)}</span>
                <span className="faq__q">{faq.question}</span>
                <span className="faq__icon" aria-hidden="true"><Plus size={18} /></span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* 10. Contato */
function Contact() {
  return (
    <section className="section contact" id="contato" aria-labelledby="contact-title">
      <div className="wrap contact__grid">
        <div className="contact__intro" data-reveal>
          <p className="label label--ink">Pedir orçamento</p>
          <h2 className="display" id="contact-title">Conte o que você precisa.</h2>
          <p className="contact__lead">Escolha o serviço e o WhatsApp já abre com a mensagem pronta. É só enviar.</p>
          <p className="contact__phone">
            {hasWhatsapp
              ? <>WhatsApp <strong>{siteConfig.whatsappDisplay}</strong></>
              : 'O canal de WhatsApp está temporariamente indisponível enquanto o número de atendimento é configurado.'}
          </p>
        </div>

        <div className="options" data-reveal>
          <p className="options__title">Qual serviço você procura?</p>
          {siteConfig.contactOptions.map((option) => (
            <WhatsAppLink className="option" key={option.label} location="contact_options" service={option.label} message={option.message}>
              <span>{option.label}</span>
              <ArrowUpRight size={20} />
            </WhatsAppLink>
          ))}
          <WhatsAppLink className="option option--wide" location="contact_cta">
            <span>Outro assunto? Fale no WhatsApp</span>
            <ArrowUpRight size={20} />
          </WhatsAppLink>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <a className="logo" href="#inicio" aria-label="S.A Engenharia — início">
            <span className="logo__mark"><img src={siteConfig.images.logo} width="1119" height="1406" alt="" /></span>
            <span className="logo__name">S.A<span>Engenharia</span></span>
          </a>
          <p>Vistorias, laudos e gerenciamento de obras.</p>
        </div>
        <div className="footer__col">
          <p className="footer__title">Serviços</p>
          <a href="#vistorias">Vistorias e laudos</a>
          <a href="#gerenciamento">Gerenciamento de obras</a>
          <a href="#projetos">Projetos e consultoria</a>
        </div>
        <div className="footer__col">
          <p className="footer__title">Atendimento presencial</p>
          {siteConfig.regions.map((region) => <p key={region}>{region}</p>)}
        </div>
        <div className="footer__col">
          <p className="footer__title">Contato</p>
          <WhatsAppLink location="footer">WhatsApp {siteConfig.whatsappDisplay}</WhatsAppLink>
          <a href="#duvidas">Dúvidas frequentes</a>
          <a href="#contato">Pedir orçamento</a>
        </div>
      </div>
      <div className="wrap footer__word" aria-hidden="true">S.A Engenharia</div>
      <div className="wrap footer__bottom">
        <p>© {new Date().getFullYear()} S.A Engenharia.</p>
        <a href="#inicio">Voltar ao topo <ArrowUpRight size={16} /></a>
      </div>
    </footer>
  )
}

function WhatsAppButton() {
  if (!hasWhatsapp) return null
  return (
    <WhatsAppLink className="whatsapp-float" location="floating_button" ariaLabel="Abrir conversa no WhatsApp">
      <WhatsAppIcon size={30} />
    </WhatsAppLink>
  )
}

export default function App() {
  useReveal()

  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Ticker />
        <Services />
        <Inspections />
        <Management />
        <HowItWorks />
        <Portfolio />
        <Projects />
        <Audiences />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
