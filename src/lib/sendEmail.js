import nodemailer from 'nodemailer';

export async function sendOrderConfirmationEmail(order) {
  try {
    // We require EMAIL_USER and EMAIL_PASS (App Password) in .env.local
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not configured. Skipping email notification.');
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.title} (x${item.quantity})</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"Ishaya Luxury" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject: `Order Confirmation - ${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #bfa15f; text-align: center;">Thank You For Your Order!</h2>
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
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent: ' + info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return false;
  }
}
