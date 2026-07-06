import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: `${slot4BrandConfig.siteName} — Local Directory + Reference Library`,
      description: 'A working local directory paired with a downloadable reference library. Discover nearby places, compare them, and read the primers that make the decision easier.',
      openGraphTitle: `${slot4BrandConfig.siteName} — Local Directory + Reference Library`,
      openGraphDescription: 'Find nearby places worth your time and reach for the reference library when you want context.',
      keywords: ['local directory', 'reference library', 'neighbourhood guides', 'downloadable references', 'community directory'],
    },
    hero: {
      badge: 'Directory · Library',
      title: ['The neighbourhood,', 'catalogued.'],
      description: 'A quiet, working directory of nearby places — paired with a growing shelf of downloadable references. Find what is close, compare it fairly, and read the primer before you go.',
      primaryCta: { label: 'Open the directory', href: '/listing' },
      secondaryCta: { label: 'Browse the library', href: '/pdf' },
      searchPlaceholder: 'Search places, references, tags…',
      focusLabel: 'Live',
      featureCardBadge: 'This week',
      featureCardTitle: 'Fresh entries, curated shelves, and quiet updates every week.',
      featureCardDescription: 'New places land on the directory as they are verified. New references land on the library as they are field-tested.',
    },
    intro: {
      badge: 'How it works',
      title: 'One home for finding places and the references you need before you go.',
      paragraphs: [
        'The directory keeps neighbourhood entries organised by what actually matters when you visit — hours, location, contact, and honest context.',
        'The library pairs each entry with downloadable primers, briefings, and field guides so the choice is not made blind.',
        'Everything else — profiles, bookmarks, journal reads, marketplace offers — sits one step away, connected by tags and cross-links.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Directory-first layout for browsing nearby places without noise.',
        'Reference library with one-click file downloads and rich previews.',
        'Cross-linked profiles, journal reads, marketplace, and bookmarks.',
        'Verified entries with trust cues, hours, and direct contact paths.',
      ],
      primaryLink: { label: 'Open the directory', href: '/listing' },
      secondaryLink: { label: 'Browse the library', href: '/pdf' },
    },
    cta: {
      badge: 'Start here',
      title: 'Save the directory. Keep the library on hand. Move faster on what matters.',
      description: 'Two connected surfaces built for slow discovery and quick decisions — a nearby-places directory and a downloadable reference shelf that stays with you.',
      primaryCta: { label: 'Open the directory', href: '/listing' },
      secondaryCta: { label: 'Talk to us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest in {label}',
      descriptionSuffix: 'The freshest posts across this shelf.',
    },
  },
  about: {
    badge: 'About us',
    title: 'A working local directory, paired with a shelf you can take with you.',
    description: `${slot4BrandConfig.siteName} exists to make finding nearby places and the context around them feel like one motion instead of two.`,
    paragraphs: [
      'We keep the directory small enough to be useful and honest enough to be trusted — every entry has hours, location, contact, and a note on what it is really like.',
      'The reference library sits next to it so the choice is not made blind: field guides, primers, briefings, and downloadable checklists you can pull down in a click.',
    ],
    values: [
      {
        title: 'Verified, not padded',
        description: 'Every directory entry is checked for hours, location, and contact before it lands. We remove more than we add.',
      },
      {
        title: 'References that travel',
        description: 'The library is downloadable on purpose. Take a primer offline, mark it up, share it with a neighbour.',
      },
      {
        title: 'Two surfaces, one motion',
        description: 'Directory and library talk to each other. A tag on an entry can pull a briefing, and a briefing can point to a place worth visiting.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Tell us what to add, verify, or fix — we route it through the right lane.',
    description: 'Suggest an entry for the directory, propose a reference for the library, flag a listing that is out of date, or say hello. Everything reaches a real person.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search the directory, library, journal, and everything else.',
    },
    hero: {
      badge: 'Search everything',
      title: 'Find places, references, and reads faster.',
      description: 'One field across the directory, the reference library, the journal, the marketplace, and the profile shelf.',
      placeholder: 'Search places, references, tags, or titles',
    },
    resultsTitle: 'What we found',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Submit an entry to the directory or a reference to the library.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit an entry.',
      description: 'An account keeps your submissions and drafts together. Sign in and we will open the contributor workspace.',
    },
    hero: {
      badge: 'Contributor workspace',
      title: 'Add to the directory or the library.',
      description: 'Pick the shelf, add the details, and prepare a clean post — with images, links, summary, and body content.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit for review',
    successTitle: 'Thanks — your entry is in the queue.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your account.',
      badge: 'Member access',
      title: 'Welcome back.',
      description: 'Sign in to continue browsing, manage submissions, and keep the entries you have saved close to hand.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'We could not match that. Create an account first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account.',
      badge: 'Get started',
      title: 'Create an account and start contributing.',
      description: 'An account lets you submit entries, save what you find, and get quiet weekly updates from the directory and the library.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More from the journal',
      fallbackTitle: 'Story details',
    },
    listing: {
      relatedTitle: 'More from the directory',
      fallbackTitle: 'Entry details',
    },
    image: {
      relatedTitle: 'More visuals',
      fallbackTitle: 'Visual details',
    },
    profile: {
      relatedTitle: 'Related reads',
      fallbackDescription: 'Profile details will appear here as soon as they are available.',
      visitButton: 'Visit official site',
    },
  },
} as const
