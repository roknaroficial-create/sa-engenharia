import { useEffect, useState } from 'react'
import { siteConfig } from '../config'
import { pad } from '../format'
import { ArrowUpRight, CloseIcon, MenuIcon } from './Icons'
import { WhatsAppLink } from './WhatsAppLink'

export function Header() {
  const [isSolid, setIsSolid] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const update = () => setIsSolid(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('is-locked', isOpen)
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.classList.remove('is-locked')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  const close = () => setIsOpen(false)

  return (
    <header className={`header${isSolid ? ' header--solid' : ''}${isOpen ? ' header--open' : ''}`}>
      <div className="wrap header__bar">
        <a className="logo" href="#inicio" onClick={close} aria-label="S.A Engenharia — início">
          <span className="logo__mark">
            <img src={siteConfig.images.logo} width="1119" height="1406" alt="" />
          </span>
          <span className="logo__name">
            S.A<span>Engenharia</span>
          </span>
        </a>

        <nav className="header__nav" id="menu-principal" aria-label="Navegação principal">
          {siteConfig.navigation.map((item, index) => (
            <a key={item.href} href={item.href} onClick={close}>
              <span className="header__nav-index" aria-hidden="true">{pad(index + 1)}</span>
              {item.label}
            </a>
          ))}
          <WhatsAppLink className="btn btn--accent header__cta" location="header" onClick={close}>
            Pedir orçamento <ArrowUpRight size={18} />
          </WhatsAppLink>
        </nav>

        <button
          className="header__toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="menu-principal"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  )
}
