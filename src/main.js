import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import '@fontsource/cormorant-garamond/latin-500-italic.css'
import '@fontsource-variable/dm-sans'
import './styles/main.css'

// ——— Kontakt: hier zentral pflegen ———
const CONTACT = {
  email: 'hallo@quantensprung.ist', // TODO: echte Adresse (auch als Fallback im HTML)
  callUrl: '', // optional: Terminbuchungs-Link (z. B. Cal.com / Calendly) für das 30-Min.-Gespräch
}

const MAILS = {
  booking: {
    subject: 'Anfrage: Retreat „Die 7 Schlüssel zur Befreiung“ – 26.–29.11.2026',
    body: [
      'Liebe Michaela, lieber Joachim,',
      '',
      'ich möchte mir gern einen Platz im Retreat „Die 7 Schlüssel zur Befreiung“ vom 26. bis 29. November 2026 sichern.',
      '',
      'Name:',
      'Telefon:',
      '',
      'Herzliche Grüße',
    ].join('\n'),
  },
  call: {
    subject: 'Kostenfreies 30-Minuten-Gespräch',
    body: [
      'Liebe Michaela, lieber Joachim,',
      '',
      'ich interessiere mich für das Retreat „Die 7 Schlüssel zur Befreiung“ und würde gern 30 Minuten kostenfrei mit euch sprechen.',
      '',
      'Telefon:',
      'Am besten erreichbar:',
      '',
      'Herzliche Grüße',
    ].join('\n'),
  },
}

const mailto = ({ subject, body }) =>
  `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

document.querySelectorAll('[data-contact]').forEach((el) => {
  const kind = el.dataset.contact
  if (kind === 'call' && CONTACT.callUrl) {
    el.href = CONTACT.callUrl
    el.target = '_blank'
    el.rel = 'noopener'
  } else if (MAILS[kind]) {
    el.href = mailto(MAILS[kind])
  }
})

document.querySelectorAll('[data-contact-email]').forEach((el) => {
  el.href = `mailto:${CONTACT.email}`
  el.textContent = CONTACT.email
})

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear())
})

// ——— Header ———
const header = document.querySelector('[data-header]')
const toggle = document.querySelector('[data-nav-toggle]')
const menu = document.querySelector('[data-nav-menu]')

const setMenu = (open) => {
  if (!toggle || !menu) return
  toggle.setAttribute('aria-expanded', String(open))
  menu.classList.toggle('is-open', open)
  header?.classList.toggle('is-open', open)
}

toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'))
menu?.addEventListener('click', (e) => {
  if (e.target.closest('a')) setMenu(false)
})
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false)
})

const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 24)
onScroll()
window.addEventListener('scroll', onScroll, { passive: true })

// ——— Reveal on scroll ———
const revealEls = document.querySelectorAll('[data-reveal]')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-revealed'))
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        io.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  )
  revealEls.forEach((el) => io.observe(el))
}

// ——— Sticky CTA (mobile): hidden while hero, pricing, final CTA or footer are visible ———
const sticky = document.querySelector('[data-sticky-cta]')
const stickyBlockers = document.querySelectorAll('[data-hide-sticky]')

if (sticky && stickyBlockers.length && 'IntersectionObserver' in window) {
  const visible = new Map()
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting))
    const show = ![...visible.values()].some(Boolean)
    sticky.classList.toggle('is-visible', show)
    sticky.inert = !show
  })
  sticky.inert = true
  stickyBlockers.forEach((el) => io.observe(el))
}
