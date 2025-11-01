import { MonsterPreview } from '@/components/monsters'
import {
  DEFAULT_MONSTER_STATE,
  MONSTER_STATES,
  type MonsterDesign,
  type MonsterState,
  type MonsterVariantId,
  type MonsterBodyShape,
  type MonsterDesignStyle
} from '@/types/monster'

export interface DashboardMonster {
  id?: string
  _id?: string
  name: string
  draw: string
  level?: number | null
  state?: MonsterState | string | null
  createdAt?: string
  updatedAt?: string
}

const mergeClasses = (...values: Array<string | undefined>): string => values.filter(Boolean).join(' ')

const MONSTER_STATE_LABELS: Record<MonsterState, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Somnolent'
}

const MONSTER_STATE_EMOJI: Record<MonsterState, string> = {
  happy: '😄',
  sad: '😢',
  angry: '😤',
  hungry: '😋',
  sleepy: '😴'
}

const STATE_BADGE_CLASSES: Record<MonsterState, string> = {
  happy: 'bg-lochinvar-100 text-lochinvar-700 ring-1 ring-inset ring-lochinvar-200',
  sad: 'bg-fuchsia-blue-100 text-fuchsia-blue-700 ring-1 ring-inset ring-fuchsia-blue-200',
  angry: 'bg-moccaccino-100 text-moccaccino-600 ring-1 ring-inset ring-moccaccino-200',
  hungry: 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200',
  sleepy: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'
}

const VARIANT_LABELS: Record<MonsterVariantId, string> = {
  cat: 'Variante féline',
  dog: 'Variante canine',
  rabbit: 'Variante lapine',
  panda: 'Variante panda'
}

const BODY_SHAPE_LABELS: Record<MonsterBodyShape, string> = {
  round: 'silhouette ronde',
  oval: 'silhouette ovale',
  bean: 'silhouette haricot',
  square: 'silhouette carrée',
  pear: 'silhouette poire'
}

const DESIGN_STYLE_LABELS: Record<MonsterDesignStyle, string> = {
  illustrated: 'Illustration animée',
  pixel: 'Pixel art dynamique'
}

const EAR_LABELS: Record<MonsterDesign['features']['earShape'], string> = {
  pointy: 'oreilles pointues',
  droopy: 'oreilles tombantes',
  long: 'oreilles allongées',
  round: 'oreilles rondes'
}

const TAIL_LABELS: Record<MonsterDesign['features']['tailShape'], string> = {
  long: 'queue longue',
  short: 'queue courte',
  puff: 'queue pompon',
  none: 'sans queue'
}

const MUZZLE_LABELS: Record<MonsterDesign['features']['muzzle'], string> = {
  small: 'petit museau',
  medium: 'museau médian',
  flat: 'museau plat'
}

const MARKING_LABELS: Record<MonsterDesign['features']['markings'], string> = {
  plain: 'pelage uni',
  mask: 'masque facial',
  patch: 'patch contrasté'
}

const isMonsterState = (value: MonsterState | string | null | undefined): value is MonsterState => (
  typeof value === 'string' && MONSTER_STATES.includes(value as MonsterState)
)

const parseMonsterDesign = (rawDraw: string): MonsterDesign | null => {
  if (typeof rawDraw !== 'string' || rawDraw.trim().length === 0) return null
  try {
    return JSON.parse(rawDraw) as MonsterDesign
  } catch (error) {
    console.error('Unable to parse monster design', error)
    return null
  }
}

const formatAdoptionDate = (value: string | undefined): string | null => {
  if (value === undefined) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const buildFeatureSummary = (design: MonsterDesign): string => {
  const traits = [
    EAR_LABELS[design.features.earShape],
    TAIL_LABELS[design.features.tailShape],
    design.features.whiskers ? 'moustaches' : 'sans moustaches',
    MUZZLE_LABELS[design.features.muzzle],
    MARKING_LABELS[design.features.markings],
    BODY_SHAPE_LABELS[design.bodyShape]
  ]

  return traits.filter((trait) => trait !== undefined && trait.length > 0).slice(0, 3).join(' · ')
}

interface MonstersListProps {
  monsters: DashboardMonster[]
  className?: string
}

function MonstersList ({ monsters, className }: MonstersListProps): React.ReactNode {
  if (monsters === null || monsters === undefined || monsters.length === 0) {
    return (
      <div className={mergeClasses('mt-10 w-full rounded-3xl bg-gradient-to-br from-white/90 via-lochinvar-50/80 to-fuchsia-blue-50/80 p-8 text-center shadow-[0_16px_40px_rgba(15,23,42,0.12)] ring-1 ring-white/70 backdrop-blur', className)}>
        <h2 className='text-xl font-semibold text-slate-900'>Tu n&apos;as pas encore de compagnon</h2>
        <p className='mt-2 text-sm text-slate-600'>Clique sur &quot;Créer une créature&quot; pour lancer ta première adoption magique.</p>
      </div>
    )
  }

  return (
    <section className={mergeClasses('mt-12 w-full space-y-8', className)}>
      <header className='space-y-2'>
        <h2 className='text-2xl font-bold text-slate-900'>Tes compagnons animés</h2>
        <p className='text-sm text-slate-600'>Un coup d&apos;oeil rapide sur ta ménagerie digitale pour préparer la prochaine aventure.</p>
      </header>

      <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
        {monsters.map((monster) => {
          const design = parseMonsterDesign(monster.draw)
          const state = isMonsterState(monster.state) ? monster.state : DEFAULT_MONSTER_STATE
          const adoptionDate = formatAdoptionDate(monster.createdAt ?? monster.updatedAt)
          const cardKey = monster.id ?? monster._id ?? monster.name
          const levelLabel = monster.level ?? 1

          return (
            <article
              key={cardKey}
              className='group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-white to-lochinvar-50/70 p-6 shadow-[0_20px_54px_rgba(15,23,42,0.14)] ring-1 ring-white/70 backdrop-blur transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.18)]'
            >
              <div className='pointer-events-none absolute -right-16 top-20 h-40 w-40 rounded-full bg-fuchsia-blue-100/40 blur-3xl transition-opacity duration-500 group-hover:opacity-60' aria-hidden='true' />
              <div className='pointer-events-none absolute -left-20 -top-16 h-48 w-48 rounded-full bg-lochinvar-100/40 blur-3xl transition-opacity duration-500 group-hover:opacity-60' aria-hidden='true' />

              <div className='relative flex flex-col gap-5'>
                <div className='relative flex items-center justify-center overflow-hidden rounded-3xl bg-slate-50/70 p-4 ring-1 ring-white/70'>
                  <MonsterPreview design={design} state={state} width={200} height={200} />
                  <span className={`absolute right-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATE_BADGE_CLASSES[state]}`}>
                    <span aria-hidden='true'>{MONSTER_STATE_EMOJI[state]}</span>
                    {MONSTER_STATE_LABELS[state]}
                  </span>
                </div>
                <div className='flex flex-1 flex-col gap-4'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='space-y-1'>
                      <h3 className='text-lg font-semibold text-slate-900 sm:text-xl'>{monster.name}</h3>
                      {adoptionDate !== null && (
                        <p className='text-xs text-slate-500'>Arrivé le {adoptionDate}</p>
                      )}
                    </div>
                    <span className='inline-flex items-center gap-1 rounded-full bg-moccaccino-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-moccaccino-600 shadow-inner'>
                      <span aria-hidden='true'>⭐</span>
                      Niveau {levelLabel}
                    </span>
                  </div>
                  <div className='flex flex-wrap gap-2 text-xs text-slate-600'>
                    {design !== null && (
                      <span className='inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 font-medium ring-1 ring-inset ring-slate-200'>
                        <span aria-hidden='true'>🎨</span>
                        {DESIGN_STYLE_LABELS[design.style]}
                      </span>
                    )}
                    {design !== null && (
                      <span className='inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 font-medium ring-1 ring-inset ring-slate-200'>
                        <span aria-hidden='true'>🧬</span>
                        {VARIANT_LABELS[design.variant]}
                      </span>
                    )}
                    <span className='inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 font-medium ring-1 ring-inset ring-slate-200'>
                      <span aria-hidden='true'>{MONSTER_STATE_EMOJI[state]}</span>
                      {MONSTER_STATE_LABELS[state]}
                    </span>
                  </div>

                  {design !== null && (
                    <div className='rounded-2xl bg-white/80 p-3 text-sm text-slate-600 shadow-inner'>
                      <p className='font-medium text-slate-800'>Signature</p>
                      <p className='mt-1 leading-snug'>{buildFeatureSummary(design)}</p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default MonstersList
