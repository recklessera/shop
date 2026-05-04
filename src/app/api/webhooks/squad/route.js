import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req) {
  try {
    // 1. Extract the Raw Body and the Squad Signature Header
    const rawBody = await req.text();
    const signature = req.headers.get('x-squad-encrypted-body');

    if (!signature) {
      return NextResponse.json({ error: 'Unauthorized: No signature provided' }, { status: 401 });
    }

    // 2. Verify the Cryptographic Signature
    // Squad hashes the payload using your Secret Key via HMAC SHA512
    const hash = crypto
      .createHmac('sha512', process.env.SQUAD_SECRET_KEY)
      .update(rawBody)
      .digest('hex');

    // Compare the hashes securely
    if (hash.toLowerCase() !== signature.toLowerCase()) {
      console.error('Webhook signature mismatch!');
      return NextResponse.json({ error: 'Unauthorized: Invalid signature' }, { status: 401 });
    }

    // 3. Parse the verified payload
    const payload = JSON.parse(rawBody);
    
    // Check if the event is a successful transaction
    // (Squad typically uses 'charge.completed' or 'transaction.successful')
    if (payload.Event === 'charge.completed' || payload.Event === 'charge.successful') {
      const transactionRef = payload.Body?.transaction_ref || payload.transaction_ref;

      if (!transactionRef) {
        return NextResponse.json({ error: 'No transaction reference found' }, { status: 400 });
      }

      // 4. Fetch the order from the database
      const order = await prisma.order.findFirst({
        where: { squad_transaction_ref: transactionRef },
        include: { items: true },
      });

      if (!order) {
        console.error(`Webhook error: Order with ref ${transactionRef} not found.`);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // 5. Idempotency Check: Did the user already trigger the success page?
      if (order.status === 'paid') {
        console.log(`Order ${order.id} is already paid. Ignoring webhook.`);
        return NextResponse.json({ message: 'Order already processed' }, { status: 200 });
      }

      // 6. Process the Order (Atomic Transaction)
      await prisma.$transaction(async (tx) => {
        // A. Mark order as paid
        await tx.order.update({
          where: { id: order.id },
          data: { status: "paid" },
        });

        // B. Deduct inventory for every item
        for (const item of order.items) {
          if (item.variant_id) {
            await tx.productVariant.update({
              where: { id: item.variant_id },
              data: {
                stock_count: {
                  decrement: item.quantity,
                },
              },
            });
          }
        }
      });

      console.log(`Webhook successfully processed order: ${order.id}`);
    }

    // 7. ALWAYS return a 200 OK to Squad immediately so they stop retrying
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    // Even if our code fails, we return a 500 so Squad knows to try again later
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}