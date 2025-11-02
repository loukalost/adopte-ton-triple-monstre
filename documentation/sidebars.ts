import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'development-guide',
    'vercel-configuration',
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/solid-principles',
        'architecture/clean-architecture'
      ]
    },
    {
      type: 'category',
      label: 'Composants',
      items: [
        'components/ui-components'
      ]
    },
    {
      type: 'category',
      label: 'Système de Monstres',
      items: [
        'monsters/monster-system'
      ]
    },
    {
      type: 'category',
      label: 'Authentification',
      items: [
        'authentication/auth-system'
      ]
    },
    {
      type: 'category',
      label: 'Système de Mise à Jour Automatique',
      items: [
        'cron/overview',
        'cron/quickstart',
        'cron/configuration',
        'cron/api-reference',
        'cron/troubleshooting'
      ]
    }
  ]
}

export default sidebars
