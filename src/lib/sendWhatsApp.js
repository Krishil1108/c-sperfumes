import twilio from 'twilio';

export async function sendOrderConfirmationWhatsApp(order) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. "whatsapp:+14155238886"

    if (!accountSid || !authToken || !twilioWhatsAppNumber) {
      console.warn('Twilio credentials not configured. Skipping WhatsApp notification.');
      return false;
    }

    const client = twilio(accountSid, authToken);

    // Format phone number to ensure it has standard E.164 formatting if needed
    // Assuming order.phone comes as "9876543210", we prefix with country code (assuming India +91 for now)
    // In production, ensure your checkout form collects full country codes.
    let customerPhone = order.phone.replace(/[^0-9]/g, '');
    if (customerPhone.length === 10) {
      customerPhone = '91' + customerPhone;
    }

    const message = await client.messages.create({
      body: `Hi ${order.customerName}! Thank you for your order at C&S Perfumes.\n\nYour order ID is: ${order.orderId}.\nTotal Amount: ₹${order.totalAmount}.\n\nWe are preparing it for shipment and will notify you when it's dispatched.`,
      from: twilioWhatsAppNumber, // Usually "whatsapp:+14155238886" in Twilio Sandbox
      to: `whatsapp:+${customerPhone}`,
    });

    console.log('Order confirmation WhatsApp sent: ' + message.sid);
    return true;
  } catch (error) {
    console.error('Failed to send order confirmation WhatsApp:', error);
    return false;
  }
}
