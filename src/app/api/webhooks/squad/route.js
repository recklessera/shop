import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { Resend } from 'resend';
import OrderReceiptEmail from '@/components/emails/OrderReceiptEmail';
import AdminNewOrderEmail from '@/components/emails/AdminNewOrderEmail';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    // 1. Extract the Raw Body and the Squad Signature Header
    const rawBody = await req.text();
    const signature = req.headers.get('x-squad-encrypted-body');

    if (!signature) {
      return NextResponse.json({ error: 'Unauthorized: No signature provided' }, { status: 401 });
    }

    // 2. Verify the Cryptographic Signature securely
    const hash = crypto
      .createHmac('sha512', process.env.SQUAD_SECRET_KEY)
      .update(rawBody)
      .digest('hex');

    if (hash.toLowerCase() !== signature.toLowerCase()) {
      console.error('Webhook signature mismatch!');
      return NextResponse.json({ error: 'Unauthorized: Invalid signature' }, { status: 401 });
    }

    // 3. Parse the verified payload
    const payload = JSON.parse(rawBody);
    
    // Squad documentation uses 'charge_successful', but we keep your checks as a safe fallback
    if (payload.Event === 'charge_successful' || payload.Event === 'charge.completed' || payload.Event === 'charge.successful') {
      const transactionRef = payload.Body?.transaction_ref || payload.transaction_ref;

      if (!transactionRef) {
        return NextResponse.json({ error: 'No transaction reference found' }, { status: 400 });
      }

      // 4. Fetch the order from the database
      const order = await prisma.order.findFirst({
        where: { squad_transaction_ref: transactionRef },
        include: { items: true, customer: true }, // Added customer include for email fallback
      });

      if (!order) {
        console.error(`Webhook error: Order with ref ${transactionRef} not found.`);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // 5. Idempotency Check: Did the webhook fire twice?
      if (order.status !== 'pending') {
        console.log(`Order ${order.id} is already processed. Ignoring webhook.`);
        return NextResponse.json({ message: 'Order already processed' }, { status: 200 });
      }

      // 6. Process the Order & Inventory (Atomic Transaction)
      await prisma.$transaction(async (tx) => {
        // A. Mark order as 'processing' (Matches our new Admin UI Statuses)
        await tx.order.update({
          where: { id: order.id },
          data: { status: "processing" },
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

      // 7. Parse the shipping address safely for the email template
      let address = {};
      try {
        address = typeof order.shipping_address === 'string' 
          ? JSON.parse(order.shipping_address) 
          : (order.shipping_address || {});
      } catch (e) {
        address = {};
      }

      // 8. Trigger the automated email via Resend
      const customerEmail = payload.Body?.email || payload.email || order.customer?.email; 
      
      if (customerEmail) {
        const { error: emailError } = await resend.emails.send({
          from: `Reckless Era <${process.env.NEXT_PUBLIC_STORE_EMAIL || 'orders@recklessera.com'}>`, 
          to: [customerEmail],
          subject: `Order Confirmed: #${order.id.slice(0, 8).toUpperCase()}`,
          react: <OrderReceiptEmail 
            firstName={address.firstName || 'Customer'} 
            orderId={order.id} 
            total={order.total_amount}
            method={address.method || 'Standard'}
            cost={address.cost || 0}
          />
        });

        if (emailError) {
          console.error('Customer Resend Error:', emailError);
        }
      }

      // FIXED: Moved the Admin Email inside the success block!
      const { error: adminEmailError } = await resend.emails.send({
        from: `Reckless System <${process.env.NEXT_PUBLIC_STORE_EMAIL || 'orders@recklessera.com'}>`, 
        to: ['recklesseraclothing@gmail.com'], 
        subject: `🚨 NEW ORDER: ₦${order.total_amount.toLocaleString()}`,
        react: <AdminNewOrderEmail 
          orderId={order.id} 
          total={order.total_amount}
          customerEmail={customerEmail || 'Unknown'}
          address={address}
          items={order.items}
        />
      });

      if (adminEmailError) {
        console.error('Admin Resend Error:', adminEmailError);
      }

      console.log(`Webhook successfully processed order: ${order.id}`);
    }

    // 9. ALWAYS return a 200 OK to Squad immediately so they stop retrying
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}