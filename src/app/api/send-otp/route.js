import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // TODO: When MSG91 Auth Key is provided, implement actual API call:
    // const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
    // const TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
    // // Make sure the phone number includes the country code (e.g., 91 for India)
    // const countryCode = phone.startsWith('+') ? '' : '91';
    // const formattedPhone = phone.startsWith('+') ? phone.replace('+', '') : `${countryCode}${phone}`;
    // const url = `https://control.msg91.com/api/v5/otp?template_id=${TEMPLATE_ID}&mobile=${formattedPhone}`;
    // const options = {
    //   method: 'POST',
    //   headers: {
    //     accept: 'application/json',
    //     'content-type': 'application/json',
    //     authkey: MSG91_AUTH_KEY
    //   }
    // };
    // const response = await fetch(url, options);
    // const data = await response.json();
    // if (data.type === 'error') throw new Error(data.message);

    // MOCK RESPONSE FOR NOW
    console.log(`[MOCK MSG91] OTP sent to ${phone}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully (Mock)',
      type: 'success'
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
  }
}
