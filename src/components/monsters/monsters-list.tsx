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

interface DashboardMonster {
  id?: string
  _id?: string
  name: string
  draw: string
  level?: number | null
  state?: MonsterState | string | null
  createdAt?: string
  updatedAt?: string
}

const MONSTER_STATE_LABELS: Record<MonsterState, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Somnolent'
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

  return traits.join(' · ')
}

function MonstersList ({ monsters }: { monsters: DashboardMonster[] }): React.ReactNode {
  if (monsters === null || monsters === undefined || monsters.length === 0) {
    return (
      <div className='mt-10 w-full rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 text-center shadow-inner'>
        <h2 className='text-lg font-semibold text-slate-900'>Aucun compagnon pour le moment</h2>
        <p className='mt-1 text-sm text-slate-500'>Créez votre premier monstre pour commencer l&apos;aventure Tamagotcho.</p>
      </div>
    )
  }

  return (
    <section className='mt-12 w-full space-y-6'>
      <header className='space-y-1'>
        <h2 className='text-2xl font-semibold text-slate-900'>Vos monstres</h2>
        <p className='text-sm text-slate-600'>Retrouvez ici votre ménagerie numérique et consultez leurs traits uniques.</p>
      </header>

      <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
        {monsters.map((monster) => {
          const design = parseMonsterDesign(monster.draw)
          const state = isMonsterState(monster.state) ? monster.state : DEFAULT_MONSTER_STATE
          const adoptionDate = formatAdoptionDate(monster.createdAt ?? monster.updatedAt)
          const cardKey = monster.id ?? monster._id ?? monster.name

          return (
            <article
              key={cardKey}
              className='group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_18px_36px_rgba(15,23,42,0.12)] backdrop-blur transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(15,23,42,0.16)]'
            >
              <div className='relative overflow-hidden rounded-2xl bg-slate-50/80 p-3 ring-1 ring-inset ring-white/60'>
                <MonsterPreview design={design} state={state} width={220} height={220} />
                <div className='pointer-events-none absolute inset-x-4 top-4 hidden items-center justify-end gap-2 sm:flex'>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${STATE_BADGE_CLASSES[state]}`}>
                    {MONSTER_STATE_LABELS[state]}
                  </span>
                </div>
              </div>

              <div className='mt-5 flex flex-1 flex-col gap-4'>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <h3 className='text-lg font-semibold text-slate-900'>{monster.name}</h3>
                    {adoptionDate !== null && (
                      <p className='text-xs text-slate-500'>Adopté le {adoptionDate}</p>
                    )}
                  </div>
                  <span className={`inline-flex sm:hidden items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${STATE_BADGE_CLASSES[state]}`}>
                    {MONSTER_STATE_LABELS[state]}
                  </span>
                </div>

                <dl className='grid grid-cols-2 gap-3 text-sm text-slate-500'>
                  <div>
                    <dt className='text-xs font-semibold uppercase tracking-wide text-slate-400'>Niveau</dt>
                    <dd className='text-base font-semibold text-moccaccino-600'>{monster.level ?? 1}</dd>
                  </div>
                  {design !== null && (
                    <div>
                      <dt className='text-xs font-semibold uppercase tracking-wide text-slate-400'>Style</dt>
                      <dd className='text-base font-medium text-slate-700'>{DESIGN_STYLE_LABELS[design.style]}</dd>
                    </div>
                  )}
                  {design !== null && (
                    <div>
                      <dt className='text-xs font-semibold uppercase tracking-wide text-slate-400'>Variante</dt>
                      <dd className='text-base font-medium text-slate-700'>{VARIANT_LABELS[design.variant]}</dd>
                    </div>
                  )}
                  <div>
                    <dt className='text-xs font-semibold uppercase tracking-wide text-slate-400'>Humeur</dt>
                    <dd className='text-base font-medium text-slate-700'>{MONSTER_STATE_LABELS[state]}</dd>
                  </div>
                </dl>

                {design !== null && (
                  <div className='rounded-2xl bg-slate-50/70 p-3 text-sm text-slate-600 shadow-inner'>
                    <p className='font-medium text-slate-800'>Traits distinctifs</p>
                    <p className='mt-1 leading-snug'>{buildFeatureSummary(design)}</p>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default MonstersList
