import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    // Basic parameters we expect Qfix to return (often transaction_id, status, checksum)
    const { transaction_id, status, amount, checksum } = data;
    const securityKey = process.env.QFIX_SECURITY_KEY || 'placeholder_qfix_security_key';

    // Typically you recreate the hash string from the returning parameters to verify it wasn't tampered with
    // Hash format depends strictly on the Qfix PDF manual. 
    // Example placeholder logic:
    const hashString = `${transaction_id}|${status}|${amount}|${securityKey}`;
    const calculatedChecksum = crypto.createHmac('sha256', securityKey).update(hashString).digest('hex').toUpperCase();

    // In a real integration, we would verify:
    // if (calculatedChecksum !== checksum) throw new Error("Checksum mismatch");

    // Redirect to success or failure page depending on status
    if (status && status.toLowerCase() === 'success') {
      return NextResponse.redirect(new URL('/?success=true', req.url));
    } else {
      return NextResponse.redirect(new URL('/checkout?error=payment_failed', req.url));
    }
    
  } catch (error) {
    console.error('Qfix Callback Error:', error);
    return NextResponse.redirect(new URL('/checkout?error=invalid_callback', req.url));
  }
}
