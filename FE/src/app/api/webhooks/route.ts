import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!

const webhookHandler = async (req: NextRequest) => {
  try {
    const buf = await req.text()
    const sig = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      // On error, log and return the error message.
      if (err! instanceof Error) console.log(err)
      console.log(`❌ Error message: ${errorMessage}`)

      return NextResponse.json(
        {
          error: {
            message: `Webhook Error: ${errorMessage}`
          }
        },
        { status: 400 }
      )
    }

    // getting to the data we want from the event
    const subscription = event.data.object as Stripe.Subscription
    const subscriptionId = subscription.id
    switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = await stripe.checkout.sessions.retrieve(subscriptionId, {
        expand: ['line_items', 'line_items.data.price.product']
      })
      console.log(checkoutSession.id)
      const data = {
        phone: checkoutSession.custom_fields[0].numeric?.value,
        address: checkoutSession.custom_fields[1].text?.value,
        note: checkoutSession.custom_fields[2].text?.value,
        totalPrice: checkoutSession.amount_total! / 100,
        listProducts: checkoutSession.line_items?.data.map((item: any) => {
          const { product } = item.price
          return {
            id: item.price.id,
            quantity: item.quantity
          }
        }),
        isPaid: true
      }
      //call api update database
      const res = await fetch(`http://localhost:8017/v1/orders/checkout/${checkoutSession.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const test = await res.json()
      console.log('find by session id', test);
      break

    default:
      break
    }

    // Return a response to acknowledge receipt of the event.
    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json(
      {
        error: {
          message: 'Method Not Allowed'
        }
      },
      { status: 405 }
    ).headers.set('Allow', 'POST')
  }
}

export { webhookHandler as POST }
