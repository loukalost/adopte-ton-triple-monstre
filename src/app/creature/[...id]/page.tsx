import { getMonsterById } from '@/actions/monsters.actions'
import ErrorClient from '@/components/error-client'
import { PixelMonster } from '@/components/monsters/pixel-monster'
import type { MonsterTraits } from '@/types/monster'

async function CreaturePage ({ params }: { params: { id: string } }): Promise<React.ReactNode> {
  const { id } = await params
  const monster = await getMonsterById(id)

  if (monster === null || monster === undefined) {
    return <ErrorClient error='Creature not found.' />
  }

  // Parse traits from JSON string
  const traits: MonsterTraits = JSON.parse(monster.traits)

  return (
    <div className='min-h-screen bg-gradient-to-b from-lochinvar-50 to-fuchsia-blue-50 py-12'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Header avec le nom du monstre */}
        <div className='text-center mb-8'>
          <h1 className='text-5xl font-bold text-moccaccino-600 mb-2'>
            {monster.name}
          </h1>
          <p className='text-lg text-lochinvar-700'>
            Niveau {monster.level}
          </p>
        </div>

        {/* Container principal avec le monstre et les informations */}
        <div className='grid md:grid-cols-2 gap-8'>
          {/* Section du monstre animé */}
          <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-4 border-lochinvar-200'>
            <div className='aspect-square max-w-md mx-auto'>
              <PixelMonster
                state={monster.state}
                traits={traits}
                level={monster.level}
              />
            </div>

            {/* État du monstre */}
            <div className='mt-6 text-center'>
              <div className='inline-block bg-gradient-to-r from-moccaccino-100 to-fuchsia-blue-100 px-6 py-3 rounded-full border-2 border-moccaccino-300'>
                <p className='text-sm font-semibold text-moccaccino-700 uppercase tracking-wide'>
                  État: <span className='text-fuchsia-blue-700'>{getStateLabel(monster.state)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Section des informations */}
          <div className='space-y-6'>
            {/* Statistiques */}
            <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-4 border-moccaccino-200'>
              <h2 className='text-2xl font-bold text-moccaccino-600 mb-4'>
                Statistiques
              </h2>
              <div className='space-y-3'>
                <StatItem label='Niveau' value={monster.level.toString()} />
                <StatItem label='État' value={getStateLabel(monster.state)} />
                <StatItem
                  label='Date de création'
                  value={new Date(monster.createdAt).toLocaleDateString('fr-FR')}
                />
                <StatItem
                  label='Dernière mise à jour'
                  value={new Date(monster.updatedAt).toLocaleDateString('fr-FR')}
                />
              </div>
            </div>

            {/* Caractéristiques physiques */}
            <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-4 border-fuchsia-blue-200'>
              <h2 className='text-2xl font-bold text-fuchsia-blue-600 mb-4'>
                Caractéristiques
              </h2>
              <div className='space-y-3'>
                <TraitItem label='Forme du corps' value={getBodyStyleLabel(traits.bodyStyle)} />
                <TraitItem label="Type d'yeux" value={getEyeStyleLabel(traits.eyeStyle)} />
                <TraitItem label='Antenne' value={getAntennaStyleLabel(traits.antennaStyle)} />
                <TraitItem label='Accessoire' value={getAccessoryLabel(traits.accessory)} />
              </div>
            </div>

            {/* Palette de couleurs */}
            <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-4 border-lochinvar-200'>
              <h2 className='text-2xl font-bold text-lochinvar-600 mb-4'>
                Palette de couleurs
              </h2>
              <div className='grid grid-cols-3 gap-3'>
                <ColorSwatch label='Corps' color={traits.bodyColor} />
                <ColorSwatch label='Accent' color={traits.accentColor} />
                <ColorSwatch label='Yeux' color={traits.eyeColor} />
                <ColorSwatch label='Antenne' color={traits.antennaColor} />
                <ColorSwatch label='Bobble' color={traits.bobbleColor} />
                <ColorSwatch label='Joues' color={traits.cheekColor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant pour afficher une statistique
function StatItem ({ label, value }: { label: string, value: string }): React.ReactNode {
  return (
    <div className='flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0'>
      <span className='text-gray-600 font-medium'>{label}</span>
      <span className='text-gray-900 font-bold'>{value}</span>
    </div>
  )
}

// Composant pour afficher une caractéristique
function TraitItem ({ label, value }: { label: string, value: string }): React.ReactNode {
  return (
    <div className='flex justify-between items-center py-2 border-b border-fuchsia-blue-100 last:border-b-0'>
      <span className='text-fuchsia-blue-700 font-medium'>{label}</span>
      <span className='text-fuchsia-blue-900 font-bold'>{value}</span>
    </div>
  )
}

// Composant pour afficher une couleur
function ColorSwatch ({ label, color }: { label: string, color: string }): React.ReactNode {
  return (
    <div className='text-center'>
      <div
        className='w-full aspect-square rounded-xl border-2 border-gray-300 shadow-md mb-2'
        style={{ backgroundColor: color }}
      />
      <p className='text-xs text-gray-600 font-medium'>{label}</p>
    </div>
  )
}

// Fonctions utilitaires pour les labels
function getStateLabel (state: string): string {
  const labels: Record<string, string> = {
    happy: 'Joyeux',
    sad: 'Triste',
    angry: 'Fâché',
    hungry: 'Affamé',
    sleepy: 'Endormi'
  }
  return labels[state] ?? state
}

function getBodyStyleLabel (style: string): string {
  const labels: Record<string, string> = {
    round: 'Rond',
    square: 'Carré',
    tall: 'Grand',
    wide: 'Large'
  }
  return labels[style] ?? style
}

function getEyeStyleLabel (style: string): string {
  const labels: Record<string, string> = {
    big: 'Grands',
    small: 'Petits',
    star: 'Étoiles',
    sleepy: 'Endormis'
  }
  return labels[style] ?? style
}

function getAntennaStyleLabel (style: string): string {
  const labels: Record<string, string> = {
    single: 'Simple',
    double: 'Double',
    curly: 'Bouclée',
    none: 'Aucune'
  }
  return labels[style] ?? style
}

function getAccessoryLabel (accessory: string): string {
  const labels: Record<string, string> = {
    horns: 'Cornes',
    ears: 'Oreilles',
    tail: 'Queue',
    none: 'Aucun'
  }
  return labels[accessory] ?? accessory
}

export default CreaturePage
