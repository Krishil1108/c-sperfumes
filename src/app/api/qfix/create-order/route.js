import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, customerName, customerEmail, customerPhone } = body;

    const merchantId = process.env.NEXT_PUBLIC_QFIX_MERCHANT_ID || 'placeholder_qfix_merchant_id';
    const securityKey = process.env.QFIX_SECURITY_KEY || 'placeholder_qfix_security_key';
    const orderId = 'QF-' + Math.floor(100000 + Math.random() * 900000);
    const returnUrl = 'http://localhost:3000/api/qfix/callback';

    // Qfix typical hash generation string: merchant_id|order_id|amount|return_url|security_key
    const hashString = `${merchantId}|${orderId}|${amount}|${returnUrl}|${securityKey}`;
    
    // Generate SHA256 HMAC (Common standard for Qfix/HDFC, might need adjustment based on exact integration kit)
    const checksum = crypto.createHmac('sha256', securityKey).update(hashString).digest('hex').toUpperCase();

    // Prepare form fields
    const formFields = {
      merchant_id: merchantId,
      order_id: orderId,
      amount: amount.toString(),
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      return_url: returnUrl,
      checksum: checksum
    };

    return NextResponse.json(formFields, { status: 200 });
  } catch (error) {
    console.error('Qfix Error:', error);
    return NextResponse.json({ error: 'Failed to generate Qfix payload' }, { status: 500 });
  }
}
