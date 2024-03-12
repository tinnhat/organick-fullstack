import { NextRequest, NextResponse } from 'next/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!)
export const GET = async (req: NextRequest, context: any) => {
  try {
    const session_id = context.params.id
    if (!session_id) return NextResponse.json({ message: 'Session ID is required' }, { status: 400 })
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'line_items.data.price.product']
    })
    return NextResponse.json({ session }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })

  }
}