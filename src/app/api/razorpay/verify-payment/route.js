import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { sendOrderConfirmationEmail } from '@/lib/sendEmail';
import { sendOrderConfirmationWhatsApp } from '@/lib/sendWhatsApp';

export async function POST(req) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      customer,
      items,
      totalAmount,
      paymentMethod
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_key_secret';

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return NextResponse.json({ status: 'error', message: 'Transaction not legit!' }, { status: 400 });
    }

    // Update the order status in your database
    if (customer && items) {
      const sanityClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '92sib1op',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        apiVersion: '2024-01-01',
        token: process.env.SANITY_API_TOKEN,
        useCdn: false,
      });

      const newOrder = {
        _type: 'order',
        orderId: `RP-${razorpay_order_id.slice(-6).toUpperCase()}`,
        customerName: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone,
        shippingAddress: {
          address: customer.address,
          city: customer.city,
          postalCode: customer.postalCode,
        },
        items: items.map(item => ({
          productId: item.id || '',
          title: item.title,
          quantity: item.quantity,
          price: item.salePrice || item.price,
        })),
        totalAmount: totalAmount,
        paymentMethod: paymentMethod || 'online',
        paymentStatus: 'Paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      };

      await sanityClient.create(newOrder);
      console.log('Order securely saved to Sanity database.');

      // Trigger notifications asynchronously so we don't block the API response
      Promise.allSettled([
        sendOrderConfirmationEmail(newOrder),
        sendOrderConfirmationWhatsApp(newOrder)
      ]).then(() => console.log('Notifications processed.'));
    }

    return NextResponse.json({
      status: 'success',
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
