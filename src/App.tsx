import { useEffect } from 'react'
import { siteConfig } from './config'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  MessageIcon,
  Plus,
} from './components/Icons'
import { ReferenceGallery } from './components/ReferenceGallery'
import { ReferenceHeader } from './components/ReferenceHeader'
import { ReferenceHero } from './components/ReferenceHero'
import { TechnicalProjectsGallery } from './components/TechnicalProjectsGallery'
import { WhatsAppLink } from './components/WhatsAppLink'
import { hasWhatsapp } from './whatsapp'

const pad = (value: number) => String(value).padStart(2, '0')

function usePageEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]')

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
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
      { threshold: 0.14, rootMargin: '0px 0px -40px' },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const updateProgress = () => {
      const scrollable = root.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      root.style.setProperty('--scroll-progress', String(progress))
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])
}

function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <a className={`brand ${footer ? 'brand--footer' : ''}`} href="#inicio" aria-label="S.A Engenharia — início">
      <span className="brand__mark"><img src={siteConfig.images.logo} width="1119" height="1406" alt="" /></span>
      <span className="brand__text"><strong>S.A</strong><span>Engenharia</span></span>
    </a>
  )
}

function SectionHeading({ id, eyebrow, title, text, light = false }: { id?: string; eyebrow: string; title: string; text?: string; light?: boolean }) {
  return (
    <div className={`section-heading ${light ? 'section-heading--light' : ''}`} data-reveal>
      <span className="eyebrow"><span aria-hidden="true">—</span> {eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

/* 1. Os dois serviços principais, lado a lado */
function Pillars() {
  return (
    <section className="pillars section" id="servicos" aria-labelledby="pillars-title">
      <div className="container">
        <SectionHeading
          id="pillars-title"
          eyebrow="Nossos serviços"
          title="Dois serviços principais. Uma mesma equipe."
          text="A vistoria confere o imóvel. O gerenciamento cuida da obra. E um costuma levar ao outro."
        />

        <div className="pillars__grid">
          {siteConfig.pillars.map((pillar) => (
            <article className="pillar" key={pillar.id} data-reveal>
              <figure className="pillar__media">
                <img
                  src={pillar.image.src}
                  width={pillar.image.width}
                  height={pillar.image.height}
                  alt={pillar.image.alt}
                  loading="lazy"
                />
                <span className="pillar__number">{pillar.number}</span>
              </figure>
              <div className="pillar__body">
                <h3>{pillar.title}</h3>
                <p className="pillar__for">{pillar.forWho}</p>
                <p className="pillar__text">{pillar.description}</p>
                <ul className="pillar__list">
                  {pillar.items.map((item) => (
                    <li key={item}><Check size={18} /> <span>{item}</span></li>
                  ))}
                </ul>
                <div className="pillar__actions">
                  <WhatsAppLink
                    className="button button--dark"
                    location={`pillar_${pillar.id}`}
                    service={pillar.title}
                    message={pillar.message}
                  >
                    {pillar.cta} <ArrowUpRight size={18} />
                  </WhatsAppLink>
                  <a className="text-link" href={`#${pillar.id}`}>Saiba mais <ArrowRight size={16} /></a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="bridge" data-reveal>
          <span className="bridge__badge" aria-hidden="true">01 <ArrowRight size={16} /> 02</span>
          <div className="bridge__text">
            <strong>Uma coisa leva à outra.</strong>
            <p>
              Fez a vistoria do apartamento novo e quer reformar? A mesma equipe que já conhece o seu imóvel pode gerenciar a obra, do primeiro dia até a entrega.
            </p>
          </div>
          <WhatsAppLink
            className="button button--light"
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

/* 2. Tipos de vistoria */
function Inspections() {
  return (
    <section className="inspections section" id="vistorias" aria-labelledby="inspections-title">
      <div className="container">
        <SectionHeading
          id="inspections-title"
          eyebrow="Vistorias e laudos"
          title="A vistoria certa para cada situação."
          text="Imóvel novo, usado, de empresa ou para banco e prefeitura: a equipe vai até o local e entrega um laudo técnico de engenharia."
        />

        <div className="inspection-grid">
          {siteConfig.inspectionTypes.map((type, index) => (
            <article className="inspection-card" key={type.title} data-reveal>
              <div className="inspection-card__top">
                <span>{pad(index + 1)}</span>
                <span className="inspection-card__tag">{type.tag}</span>
              </div>
              <h3>{type.title}</h3>
              <p>{type.text}</p>
              <WhatsAppLink
                className="inspection-card__link"
                location="inspection_card"
                service={type.title}
                message={type.message}
              >
                Pedir orçamento <ArrowUpRight size={16} />
              </WhatsAppLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* 3. Gerenciamento de obras */
function Management() {
  return (
    <section className="management" id="gerenciamento" aria-labelledby="management-title">
      <div className="blueprint-lines" aria-hidden="true" />
      <div className="container management__grid">
        <div className="management__diagram" data-reveal aria-hidden="true">
          <div className="management__diagram-top"><span>02</span><span>Gerenciamento de obras</span></div>
          <div className="management__diagram-core"><span>S.A</span><small>sua obra</small></div>
          <div className="management__diagram-item management__diagram-item--one"><span>01</span> Prazo</div>
          <div className="management__diagram-item management__diagram-item--two"><span>02</span> Custo</div>
          <div className="management__diagram-item management__diagram-item--three"><span>03</span> Qualidade</div>
          <div className="management__diagram-ring" />
        </div>
        <div className="management__content" data-reveal>
          <span className="eyebrow eyebrow--light"><span aria-hidden="true">—</span> Gerenciamento de obras</span>
          <h2 id="management-title">Sua obra cuidada <em>como se fosse nossa.</em></h2>
          <p className="management__lead">
            Para obra nova, reforma, prédio ou loja. Você contrata, a gente acompanha tudo de perto e você só se preocupa em receber a obra pronta.
          </p>
          <ul className="scope-list">
            {siteConfig.managementScope.map((item) => (
              <li key={item.title}>
                <Check size={18} />
                <div><strong>{item.title}</strong><span>{item.text}</span></div>
              </li>
            ))}
          </ul>
          <WhatsAppLink
            className="button button--light"
            location="management"
            service="Gerenciamento de obras"
            message="Olá! Vim pelo site e quero um orçamento de gerenciamento de obra."
          >
            Quero gerenciar minha obra <ArrowUpRight />
          </WhatsAppLink>
        </div>
      </div>
    </section>
  )
}

/* 4. Passo a passo de cada serviço */
type Step = { readonly title: string; readonly text: string }

function StepsColumn({ number, title, steps, cta, message, service }: { number: string; title: string; steps: readonly Step[]; cta: string; message: string; service: string }) {
  return (
    <article className="how__column" data-reveal>
      <header className="how__column-header">
        <span>{number}</span>
        <h3>{title}</h3>
      </header>
      <ol className="steps">
        {steps.map((step, index) => (
          <li key={step.title}>
            <span className="steps__number" aria-hidden="true">{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <WhatsAppLink className="button button--dark" location="how_it_works" service={service} message={message}>
        {cta} <ArrowUpRight size={18} />
      </WhatsAppLink>
    </article>
  )
}

function HowItWorks() {
  return (
    <section className="how section" id="como-funciona" aria-labelledby="how-title">
      <div className="container">
        <SectionHeading
          id="how-title"
          eyebrow="Como funciona"
          title="Simples, do primeiro contato à entrega."
          text="Sem complicação: veja o passo a passo de cada serviço."
        />
        <div className="how__grid">
          <StepsColumn
            number="01"
            title="Vistoria e laudo"
            steps={siteConfig.steps.inspection}
            cta="Pedir uma vistoria"
            service="Vistorias e laudos"
            message="Olá! Vim pelo site e quero um orçamento de vistoria de imóvel."
          />
          <StepsColumn
            number="02"
            title="Gerenciamento de obra"
            steps={siteConfig.steps.management}
            cta="Pedir gerenciamento"
            service="Gerenciamento de obras"
            message="Olá! Vim pelo site e quero um orçamento de gerenciamento de obra."
          />
        </div>
      </div>
    </section>
  )
}

/* 5. Fotos reais de obra e vistoria */
function FieldPhotos() {
  return (
    <section className="field-photos" aria-labelledby="field-photos-title">
      <div className="container">
        <div className="field-photos__header" data-reveal>
          <span className="eyebrow"><span aria-hidden="true">—</span> Fotos reais</span>
          <h2 id="field-photos-title">Na obra e no imóvel, de perto.</h2>
          <p>Registros de obras e vistorias acompanhadas pela equipe da S.A Engenharia.</p>
        </div>
        <div className="field-photos__grid">
          {siteConfig.images.fieldPhotos.map((photo) => (
            <figure className="field-photo" key={photo.src} data-reveal>
              <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" />
              <figcaption>
                <span>{photo.category}</span>
                <strong>{photo.label}</strong>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* 6. Projetos e consultoria */
function OtherServices() {
  return (
    <section className="other-services" id="projetos" aria-labelledby="other-services-title">
      <div className="container other-services__grid">
        <div className="other-services__intro" data-reveal>
          <span className="eyebrow"><span aria-hidden="true">—</span> Também fazemos</span>
          <h2 id="other-services-title">Projetos e consultoria.</h2>
        </div>
        {siteConfig.otherServices.map((service, index) => (
          <article className="other-service" key={service.title} data-reveal>
            <span>{pad(index + 1)}</span>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
            <WhatsAppLink className="text-link" location="other_services" service={service.title} message={service.message}>
              Pedir orçamento <ArrowUpRight size={16} />
            </WhatsAppLink>
          </article>
        ))}
      </div>
    </section>
  )
}

function Audiences() {
  return (
    <section className="audiences section section--dark" aria-labelledby="audiences-title">
      <div className="container audiences__grid">
        <div className="audiences__intro" data-reveal>
          <span className="eyebrow eyebrow--light"><span aria-hidden="true">—</span> Para quem é</span>
          <h2 id="audiences-title">Para quem tem um imóvel ou uma obra pela frente.</h2>
          <p>Pessoas, imobiliárias e empresas: cada um com a sua necessidade.</p>
        </div>
        <div className="audience-list">
          {siteConfig.audiences.map((audience, index) => (
            <article key={audience.name} data-reveal>
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

function About() {
  return (
    <section className="about section" id="sobre">
      <div className="container about__grid">
        <figure className="about__media" data-reveal>
          <img
            src={siteConfig.images.gallery[2].src}
            width={siteConfig.images.gallery[2].width}
            height={siteConfig.images.gallery[2].height}
            alt={siteConfig.images.gallery[2].alt}
            loading="lazy"
          />
          <figcaption>Atenção a cada detalhe da entrega.</figcaption>
        </figure>
        <div className="about__title" data-reveal>
          <span className="eyebrow"><span aria-hidden="true">—</span> Sobre a S.A Engenharia</span>
          <h2>Uma equipe de engenharia que começou nas vistorias.</h2>
        </div>
        <div className="about__story" data-reveal>
          <p className="about__lead">
            A S.A Engenharia atua há <strong>{siteConfig.yearsInBusiness} anos.</strong> Começou com vistorias e projetos e hoje também gerencia obras do início ao fim.
          </p>
          <p>
            Trabalhamos em equipe, com atendimento presencial e atenção a cada detalhe: da conferência de um imóvel novo ao acompanhamento de uma obra inteira.
          </p>
        </div>
        <div className="values" data-reveal>
          <span className="values__label">O que guia nosso trabalho</span>
          <div className="values__list">
            {siteConfig.values.map((value, index) => (
              <div key={value}><span>{pad(index + 1)}</span><strong>{value}</strong></div>
            ))}
          </div>
        </div>
        <div className="about__monogram" aria-hidden="true">S<span>A</span></div>
      </div>
    </section>
  )
}

function Regions() {
  return (
    <section className="regions" id="atendimento">
      <div className="container regions__grid">
        <div className="regions__copy" data-reveal>
          <span className="eyebrow"><span aria-hidden="true">—</span> Onde atendemos</span>
          <h2>Atendimento presencial.</h2>
          <p>A equipe vai até o seu imóvel ou a sua obra em São Paulo capital, na Grande São Paulo e em Uberaba/MG.</p>
          <WhatsAppLink className="text-link" location="regions">
            Pedir orçamento <ArrowUpRight size={16} />
          </WhatsAppLink>
        </div>
        <div className="region-list">
          {siteConfig.regions.map((region, index) => (
            <div key={region} data-reveal>
              <span>{pad(index + 1)}</span>
              <strong>{region}</strong>
              <MapPin />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section className="faq section" id="duvidas" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__intro" data-reveal>
          <span className="eyebrow"><span aria-hidden="true">—</span> Dúvidas frequentes</span>
          <h2 id="faq-title">Perguntas que todo mundo faz.</h2>
          <p>Não achou sua dúvida? Pergunte direto no WhatsApp.</p>
        </div>
        <div className="faq__list">
          {siteConfig.faqs.map((faq, index) => (
            <details key={faq.question} data-reveal>
              <summary><span>{pad(index + 1)}</span>{faq.question}<Plus /></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact" id="contato">
      <div className="container contact__grid">
        <div className="contact__intro" data-reveal>
          <span className="eyebrow"><span aria-hidden="true">—</span> Pedir orçamento</span>
          <h2>Conte o que você precisa.</h2>
          <p>Escolha o serviço e o WhatsApp já abre com a mensagem pronta. É só enviar.</p>
          <div className="contact__note">
            <MessageIcon />
            <span>
              {hasWhatsapp
                ? `Atendimento pelo WhatsApp ${siteConfig.whatsappDisplay}.`
                : 'O canal de WhatsApp está temporariamente indisponível enquanto o número de atendimento é configurado.'}
            </span>
          </div>
        </div>

        <div className="contact-cta" data-reveal>
          <MessageIcon />
          <h3>Qual serviço você procura?</h3>
          <div className="contact-options">
            {siteConfig.contactOptions.map((option) => (
              <WhatsAppLink
                className="contact-option"
                key={option.label}
                location="contact_options"
                service={option.label}
                message={option.message}
              >
                <span>{option.label}</span>
                <ArrowUpRight size={18} />
              </WhatsAppLink>
            ))}
          </div>
          <WhatsAppLink className="button button--contact" location="contact_cta">
            Outro assunto? Fale no WhatsApp <ArrowUpRight />
          </WhatsAppLink>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <Logo footer />
        <div className="footer__column">
          <span>Serviços</span>
          <a href="#vistorias">Vistorias e laudos</a>
          <a href="#gerenciamento">Gerenciamento de obras</a>
          <a href="#projetos">Projetos e consultoria</a>
        </div>
        <div className="footer__column">
          <span>Atendimento presencial</span>
          {siteConfig.regions.map((region) => <p key={region}>{region}</p>)}
        </div>
        <div className="footer__column">
          <span>Contato</span>
          <WhatsAppLink location="footer">WhatsApp {siteConfig.whatsappDisplay}</WhatsAppLink>
          <a href="#duvidas">Dúvidas frequentes</a>
          <a href="#contato">Pedir orçamento</a>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} S.A Engenharia.</p>
        <p>Vistorias, laudos e gerenciamento de obras.</p>
        <a href="#inicio">Voltar ao topo <ArrowUpRight size={16} /></a>
      </div>
    </footer>
  )
}

function WhatsAppButton() {
  if (!hasWhatsapp) return null
  return (
    <WhatsAppLink className="whatsapp-float" location="floating_button" ariaLabel="Abrir conversa no WhatsApp">
      <MessageIcon />
    </WhatsAppLink>
  )
}

export default function App() {
  usePageEffects()

  return (
    <>
      <ReferenceHeader />
      <main id="conteudo">
        <ReferenceHero />
        <Pillars />
        <Inspections />
        <Management />
        <HowItWorks />
        <FieldPhotos />
        <ReferenceGallery />
        <OtherServices />
        <TechnicalProjectsGallery type="autocad" />
        <TechnicalProjectsGallery type="3d" />
        <Audiences />
        <About />
        <Regions />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
