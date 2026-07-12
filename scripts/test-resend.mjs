import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('Sending test email using Resend...');
  const { data, error } = await resend.emails.send({
    from: `Ishaya Luxury <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: 'shahkrishil1108@gmail.com',
    subject: 'Test Order Confirmation - Resend Setup',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://www.ishayaluxury.com/perfume-icon.png" alt="Ishaya Luxury" style="max-height: 80px; width: auto;" />
        </div>
        <h2 style="color: #bfa15f; text-align: center; margin-top: 0;">This is a Test Email!</h2>
        <p>Hi Krishil,</p>
        <p>If you are reading this, your Resend API integration is completely successful, and the verified domain <strong>updates.ishayaluxury.in</strong> is working perfectly!</p>
        <p>Your production orders will now receive beautifully formatted receipts automatically.</p>
        <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #888;">
          Ishaya Luxury Perfumes Test System
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('❌ Failed to send email:', error);
  } else {
    console.log('✅ Successfully sent test email! ID:', data.id);
  }
}

testResend();
