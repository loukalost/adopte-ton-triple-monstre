/**
 * API Route pour renouveler les quêtes journalières à minuit
 *
 * Cette route peut être appelée :
 * - Par Vercel Cron Jobs (configuration dans vercel.json)
 * - Automatiquement via un service de ping quotidien
 * - Manuellement pour tester
 *
 * @endpoint GET/POST /api/cron/renew-quests
 */
import { NextRequest, NextResponse } from 'next/server'
import { renewAllDailyQuests } from '@/actions/quests.actions'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 secondes max d'exécution

/**
 * Logger avec timestamp pour un meilleur suivi
 */
function log (level: 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [CRON-RENEW-QUESTS] [${level.toUpperCase()}]`

  if (data !== undefined) {
    console[level](`${prefix} ${message}`, data)
  } else {
    console[level](`${prefix} ${message}`)
  }
}

export async function GET (request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()

  log('info', '🚀 Démarrage du renouvellement des quêtes journalières...')

  try {
    // 1. Sécurité optionnelle : vérifier un token secret
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET_TOKEN

    if ((expectedToken ?? '') !== '') {
      if (authHeader !== `Bearer ${expectedToken ?? ''}`) {
        log('warn', '🔒 Tentative d\'accès non autorisée', {
          ip: request.headers.get('x-forwarded-for') ?? 'unknown',
          userAgent: request.headers.get('user-agent') ?? 'unknown'
        })

        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid or missing token' },
          { status: 401 }
        )
      }
    }

    // 2. Renouveler les quêtes pour tous les utilisateurs
    log('info', '🔄 Renouvellement des quêtes...')
    const result = await renewAllDailyQuests()

    if (!result.success) {
      log('error', '❌ Échec du renouvellement des quêtes')
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to renew daily quests',
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime
        },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    log('info', `✅ Renouvellement terminé avec succès`, {
      usersUpdated: result.count,
      duration: `${duration}ms`
    })

    return NextResponse.json({
      success: true,
      usersUpdated: result.count,
      message: `Successfully renewed quests for ${result.count} users`,
      timestamp: new Date().toISOString(),
      duration
    })
  } catch (error) {
    const duration = Date.now() - startTime
    log('error', '💥 Erreur lors du renouvellement des quêtes', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        duration
      },
      { status: 500 }
    )
  }
}

// Support POST pour plus de flexibilité
export async function POST (request: NextRequest): Promise<NextResponse> {
  return await GET(request)
}
