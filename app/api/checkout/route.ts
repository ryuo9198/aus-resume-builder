import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY が設定されていません' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://aus-resume-builder.vercel.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: 'Aus Resume & Cover Letter Pack',
              description: 'Australian Standard Resume (PDF) + Tailored Cover Letter',
            },
            unit_amount: 499, // $4.99 AUD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?paid=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Stripe error' }, { status: 500 });
  }
}