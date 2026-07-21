import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('Sending test email using Resend...');
  
  const mockOrder = {
    orderId: 'RP-A1B2C3',
    customerName: 'Krishil Shah',
    email: 'shahkrishil1108@gmail.com',
    paymentMethod: 'online',
    totalAmount: 2499,
    shippingAddress: {
      address: '123 Luxury Avenue, Suite 4B',
      city: 'Mumbai',
      postalCode: '400001'
    },
    items: [
      {
        title: 'Amber & Musk',
        quantity: 1,
        price: 1499,
        image: 'https://raw.githubusercontent.com/Krishil1108/perfumes-sk/main/public/amber-musk.jpg'
      },
      {
        title: 'Floral Bouquet',
        quantity: 1,
        price: 1000,
        image: 'https://images.pexels.com/photos/931166/pexels-photo-931166.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ]
  };

  const itemsHtml = mockOrder.items.map(item => {
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

  const { data, error } = await resend.emails.send({
    from: `CNSS <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: mockOrder.email,
    subject: `Order Confirmed - ${mockOrder.orderId}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222; background-color: #fafafa; padding: 40px 20px;">
        
        <!-- Logo & Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://raw.githubusercontent.com/Krishil1108/perfumes-sk/main/public/perfume-icon.png" alt="CNSS" style="max-height: 70px; width: auto;" />
          <div style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #bfa15f; margin-top: 10px;">The Essence of Elegance</div>
        </div>

        <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #111; margin: 0; font-size: 24px;">Thank You For Your Order!</h2>
            <p style="color: #666; font-size: 15px; line-height: 1.6; margin-top: 10px;">Hi ${mockOrder.customerName}, your order has been successfully placed. We're currently preparing your luxurious fragrances for dispatch.</p>
          </div>

          <!-- Order Info & Payment Status -->
          <table style="width: 100%; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 30px; border: 1px solid #eee; border-collapse: collapse;">
            <tr>
              <td style="padding: 20px; text-align: left; vertical-align: top; width: 50%;">
                <div style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Order Number</div>
                <div style="font-weight: bold; font-size: 16px; margin-top: 4px; color: #111;">${mockOrder.orderId}</div>
              </td>
              <td style="padding: 20px; text-align: right; vertical-align: top; width: 50%;">
                <div style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Payment Status</div>
                <div style="font-weight: bold; font-size: 16px; color: #1e8e3e; margin-top: 4px;">
                  <span style="font-size: 18px; vertical-align: middle;">✅</span>
                  <span style="vertical-align: middle;">&nbsp;Paid via ${mockOrder.paymentMethod === 'online' ? 'Razorpay' : mockOrder.paymentMethod}</span>
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
                <td style="padding: 15px; font-weight: bold; font-size: 18px; text-align: right; color: #bfa15f;">₹${mockOrder.totalAmount}</td>
              </tr>
            </tfoot>
          </table>
          
          <!-- Shipping Info -->
          <h3 style="font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #bfa15f; padding-bottom: 10px; display: inline-block;">Shipping Address</h3>
          <p style="color: #555; line-height: 1.6; margin-top: 0; padding: 15px; background: #f9f9f9; border-radius: 8px; border: 1px solid #eee;">
            <strong>${mockOrder.customerName}</strong><br>
            ${mockOrder.shippingAddress.address}<br>
            ${mockOrder.shippingAddress.city} - ${mockOrder.shippingAddress.postalCode}
          </p>

        </div>

        <!-- Footer / Signatures -->
        <div style="text-align: center; margin-top: 40px; color: #888;">
          <p style="font-size: 14px; font-style: italic;">"Fragrance is the invisible, unforgettable, ultimate accessory."</p>
          
          <div style="margin: 30px 0;">
            <p style="margin: 0; font-size: 14px;">With gratitude,</p>
            <p style="margin: 5px 0 0 0; font-family: 'Georgia', serif; font-size: 20px; color: #111;">The CNSS Team</p>
          </div>

          <div style="border-top: 1px solid #ddd; margin: 30px 0; padding-top: 30px; font-size: 12px; line-height: 1.8;">
            <p style="margin: 0;"><strong>Need Assistance?</strong></p>
            <p style="margin: 0;">Call our helpline: <strong>+91 98765 43210</strong></p>
            <p style="margin: 0;">Email: support@cnssluxury.com</p>
            
            <p style="margin: 20px 0 0 0; color: #aaa;">
              <strong>Terms & Conditions:</strong><br>
              Please note that all orders are subject to availability and confirmation of the order price. Dispatch times may vary according to availability. For our full return policy and terms of service, please visit our website.
            </p>
            <p style="margin-top: 20px; color: #aaa;">&copy; ${new Date().getFullYear()} CNSS. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('❌ Failed to send email:', error);
  } else {
    console.log('✅ Successfully sent HTML test email! ID:', data.id);
  }
}

testResend();
