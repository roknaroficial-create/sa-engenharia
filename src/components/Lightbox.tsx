import { useEffect, useRef } from 'react'
import { pad } from '../format'
import { ArrowRight, CloseIcon } from './Icons'

export type Photo = {
  readonly src: string
  readonly width: number
  readonly height: number
  readonly alt: string
  readonly label: string
  readonly category: string
  readonly description?: string
}

type LightboxProps = {
  photos: readonly Photo[]
  index: number
  onClose: () => void
  onChange: (index: number) => void
}

export function Lightbox({ photos, index, onClose, onChange }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const photo = photos[index]
  const total = photos.length
  const previous = (index - 1 + total) % total
  const next = (index + 1) % total

  useEffect(() => {
    document.body.classList.add('is-locked')
    closeRef.current?.focus()
    return () => document.body.classList.remove('is-locked')
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onChange(previous)
      if (event.key === 'ArrowRight') onChange(next)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onChange, previous, next])

  if (!photo) return null

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Foto ampliada: ${photo.label}`} onClick={onClose}>
      <button ref={closeRef} className="lightbox__btn lightbox__close" type="button" onClick={onClose} aria-label="Fechar foto">
        <CloseIcon />
      </button>
      <button
        className="lightbox__btn lightbox__prev"
        type="button"
        aria-label="Foto anterior"
        onClick={(event) => {
          event.stopPropagation()
          onChange(previous)
        }}
      >
        <ArrowRight />
      </button>
      <figure className="lightbox__figure" onClick={(event) => event.stopPropagation()}>
        <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} />
        <figcaption>
          <span>{pad(index + 1)} / {pad(total)}</span>
          <strong>{photo.label}</strong>
          {photo.description && <small>{photo.description}</small>}
        </figcaption>
      </figure>
      <button
        className="lightbox__btn lightbox__next"
        type="button"
        aria-label="Próxima foto"
        onClick={(event) => {
          event.stopPropagation()
          onChange(next)
        }}
      >
        <ArrowRight />
      </button>
    </div>
  )
}
