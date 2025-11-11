// Interface Segregation Principle: Small, focused interfaces

export interface NavigationItem {
  href: string
  label: string
}

export interface BenefitCardProps {
  icon: string
  title: string
  description: string
  colorTheme: 'electric' | 'neon-purple' | 'neutral'
}

export interface MonsterCardProps {
  emoji: string
  name: string
  personality: string
}

export interface ActionCardProps {
  icon: string
  title: string
  description: string
  colorTheme: 'electric' | 'neon-purple' | 'neutral'
}

export interface FooterLinkGroup {
  title: string
  links: Array<{
    label: string
    href: string
  }>
}

export interface NewsletterFormData {
  email: string
}
