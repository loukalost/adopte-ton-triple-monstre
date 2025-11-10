import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

export async function POST (request: Request): Promise<Response> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    return new Response('Unauthorized', { status: 401 })
  }

  const amount = 1000

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: '500 Koins'
          },
          unit_amount: amount
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL as string}/wallet`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL as string}/wallet`,
    metadata: {
      userId: session.user.id
    }
  })

  return new Response(JSON.stringify({ url: checkoutSession.url }), { status: 200 })
}
