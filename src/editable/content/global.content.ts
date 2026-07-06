import { slot4BrandConfig } from '@/editable/theme/brand.config'

/*
  Navbar in this redesign carries no task-page links — only the logo,
  About, Contact, search, and auth actions. Task categories still show
  up under the footer's "Directory" column so discovery stays intact.
*/

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'The neighbourhood, catalogued.',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Local Directory · Reference Library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Sign in', href: '/login' },
    },
  },
  footer: {
    tagline: 'The neighbourhood, catalogued.',
    description: 'A working local directory paired with a downloadable reference library — built to help you find nearby places, compare them, and read the primers that make the choice easier.',
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Local Directory', href: '/listing' },
          { label: 'Reference Library', href: '/pdf' },
        ],
      },
      {
        title: 'Account',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Submit an entry', href: '/create' },
        ],
      },
    ],
    ctaStrip: {
      eyebrow: 'Weekly',
      title: 'One quiet email. The best of the directory + one new reference.',
      cta: { label: 'Get started', href: '/signup' },
    },
    bottomNote: 'Built for slow discovery and fast action.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
