import { Resend } from 'resend';

export async function sendOrderConfirmationEmail(order) {
  try {
    // We require RESEND_API_KEY in .env.local
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Skipping email notification.');
      return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.title} (x${item.quantity})</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price}</td>
      </tr>
    `).join('');

    // Resend requires a verified domain to send FROM. 
    // If you haven't verified a domain yet, you can only send TO the email address you registered Resend with,
    // and you MUST use 'onboarding@resend.dev' as the FROM address during testing.
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev';

    const { data, error } = await resend.emails.send({
      from: `Ishaya Luxury <${fromAddress}>`,
      to: order.email,
      subject: `Order Confirmation - ${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://www.ishayaluxury.com/perfume-icon.png" alt="Ishaya Luxury" style="max-height: 80px; width: auto;" />
          </div>
          <h2 style="color: #bfa15f; text-align: center; margin-top: 0;">Thank You For Your Order!</h2>
          <p>Hi ${order.customerName},</p>
          <p>We've received your order <strong>${order.orderId}</strong> and are getting it ready for shipment.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 10px; font-weight: bold;">Total</td>
                <td style="padding: 10px; font-weight: bold; text-align: right;">₹${order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>
          
          <p style="margin-top: 30px;"><strong>Shipping Address:</strong><br>
          ${order.shippingAddress.address}<br>
          ${order.shippingAddress.city} - ${order.shippingAddress.postalCode}</p>
          
          <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #888;">
            Ishaya Luxury Perfumes<br>
            For any questions, reply to this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send Resend email:', error);
      return false;
    }

    console.log('Order confirmation email sent via Resend: ' + data.id);
    return true;
  } catch (error) {
    console.error('Fatal error sending Resend email:', error);
    return false;
  }
}
