function getSize (size: 'sm' | 'md' | 'lg' | 'xl'): string {
  switch (size) {
    case 'sm': return 'px-2 py-1 text-xs'
    case 'md': return 'px-3 py-1.5 text-sm'
    case 'lg': return 'px-4 py-2 text-base'
    case 'xl': return 'px-6 py-3 text-lg'
  }
}

function getVariant (variant: 'primary' | 'ghost' | 'underline' | 'outline', disabled: boolean): string {
  // Use CSS variables defined in src/app/globals.css (ex: --color-electric-500)
  // Tailwind arbitrary value syntax is used to reference those variables.
  switch (variant) {
    case 'primary':
      return disabled
        ? 'bg-[color:var(--color-electric-200)] text-[color:var(--color-electric-500)]'
        : 'bg-[color:var(--color-electric-500)] hover:bg-[color:var(--color-electric-700)] text-white'
    case 'ghost':
      return disabled
        ? 'bg-transparent text-[color:var(--color-neutral-400)]'
        : 'bg-transparent text-[color:var(--color-electric-500)] hover:bg-[color:var(--color-electric-50)]'
    case 'underline':
      return disabled
        ? 'underline text-[color:var(--color-neutral-400)]'
        : 'underline hover:no-underline underline-offset-6 text-[color:var(--color-electric-500)]'
    case 'outline':
      return disabled
        ? 'border border-[color:var(--color-neutral-300)] text-[color:var(--color-neutral-400)]'
        : 'border border-[color:var(--color-electric-500)] text-[color:var(--color-electric-500)] hover:bg-[color:var(--color-electric-50)]'
  }
}

function Button ({
  children = 'Click me',
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false,
  type
}: {
  children: React.ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'ghost' | 'underline' | 'outline'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}): React.ReactNode {
  return (
    <button
      className={`rounded-md ${disabled ? '' : 'transition-all duration-300 cursor-pointer active:scale-95'} ${getSize(size)} ${getVariant(variant, disabled)}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button
