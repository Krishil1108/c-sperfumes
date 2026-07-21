import { Resend } from 'resend';

export async function sendOrderConfirmationEmail(order) {
  try {
    // We require RESEND_API_KEY in .env.local
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Skipping email notification.');
      return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const itemsHtml = order.items.map(item => {
      // Provide a fallback placeholder if image is missing
      const imgSrc = item.image || 'https://raw.githubusercontent.com/Krishil1108/perfumes-sk/main/public/perfume-icon.png';
      return `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #eee; vertical-align: middle; width: 60px;">
          <img src="${imgSrc}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #eaeaea;" />
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #eee; vertical-align: middle;">
          <div style="font-weight: bold; color: #333; font-size: 14px;">${item.title}</div>
          <div style="color: #888; font-size: 12px; margin-top: 4px;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #eee; vertical-align: middle; text-align: right; font-weight: bold; color: #333;">
          ₹${item.price}
        </td>
      </tr>
      `;
    }).join('');

    const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev';

    const { data, error } = await resend.emails.send({
      from: `C&S Perfumes <${fromAddress}>`,
      to: order.email,
      subject: `Order Confirmed - ${order.orderId}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222; background-color: #fafafa; padding: 40px 20px;">
          
          <!-- Logo & Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://raw.githubusercontent.com/Krishil1108/perfumes-sk/main/public/perfume-icon.png" alt="C&S Perfumes" style="max-height: 70px; width: auto;" />
            <div style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #bfa15f; margin-top: 10px;">The Essence of Elegance</div>
          </div>

          <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #111; margin: 0; font-size: 24px;">Thank You For Your Order!</h2>
              <p style="color: #666; font-size: 15px; line-height: 1.6; margin-top: 10px;">Hi ${order.customerName}, your order has been successfully placed. We're currently preparing your luxurious fragrances for dispatch.</p>
            </div>

            <!-- Order Info & Payment Status -->
            <table style="width: 100%; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 30px; border: 1px solid #eee; border-collapse: collapse;">
              <tr>
                <td style="padding: 20px; text-align: left; vertical-align: top; width: 50%;">
                  <div style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Order Number</div>
                  <div style="font-weight: bold; font-size: 16px; margin-top: 4px; color: #111;">${order.orderId}</div>
                </td>
                <td style="padding: 20px; text-align: right; vertical-align: top; width: 50%;">
                  <div style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Payment Status</div>
                  <div style="font-weight: bold; font-size: 16px; color: #1e8e3e; margin-top: 4px;">
                    <span style="font-size: 18px; vertical-align: middle;">✅</span>
                    <span style="vertical-align: middle;">&nbsp;Paid via ${order.paymentMethod === 'online' ? 'Razorpay' : order.paymentMethod}</span>
                  </div>
                </td>
              </tr>
            </table>
            
            <!-- Order Summary Table -->
            <h3 style="font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #bfa15f; padding-bottom: 10px; display: inline-block;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 15px; font-weight: bold; font-size: 16px; text-align: right;">Total Amount</td>
                  <td style="padding: 15px; font-weight: bold; font-size: 18px; text-align: right; color: #bfa15f;">₹${order.totalAmount}</td>
                </tr>
              </tfoot>
            </table>
            
            <!-- Shipping Info -->
            <h3 style="font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #bfa15f; padding-bottom: 10px; display: inline-block;">Shipping Address</h3>
            <p style="color: #555; line-height: 1.6; margin-top: 0; padding: 15px; background: #f9f9f9; border-radius: 8px; border: 1px solid #eee;">
              <strong>${order.customerName}</strong><br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city} - ${order.shippingAddress.postalCode}
            </p>

          </div>

          <!-- Footer / Signatures -->
          <div style="text-align: center; margin-top: 40px; color: #888;">
            <p style="font-size: 14px; font-style: italic;">"Fragrance is the invisible, unforgettable, ultimate accessory."</p>
            
            <div style="margin: 30px 0;">
              <p style="margin: 0; font-size: 14px;">With gratitude,</p>
              <p style="margin: 5px 0 0 0; font-family: 'Georgia', serif; font-size: 20px; color: #111;">The C&S Perfumes Team</p>
            </div>

            <div style="border-top: 1px solid #ddd; margin: 30px 0; padding-top: 30px; font-size: 12px; line-height: 1.8;">
              <p style="margin: 0;"><strong>Need Assistance?</strong></p>
              <p style="margin: 0;">Call our helpline: <strong>+91 98765 43210</strong></p>
              <p style="margin: 0;">Email: support@cnssluxury.com</p>
              
              <p style="margin: 20px 0 0 0; color: #aaa;">
                <strong>Terms & Conditions:</strong><br>
                Please note that all orders are subject to availability and confirmation of the order price. Dispatch times may vary according to availability. For our full return policy and terms of service, please visit our website.
              </p>
              <p style="margin-top: 20px; color: #aaa;">&copy; ${new Date().getFullYear()} C&S Perfumes. All rights reserved.</p>
            </div>
          </div>
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
