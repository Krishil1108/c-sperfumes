import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone number and OTP are required' }, { status: 400 });
    }

    // TODO: When MSG91 Auth Key is provided, implement actual API call:
    // const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
    // const countryCode = phone.startsWith('+') ? '' : '91';
    // const formattedPhone = phone.startsWith('+') ? phone.replace('+', '') : `${countryCode}${phone}`;
    // const url = `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${formattedPhone}`;
    // const options = {
    //   method: 'GET',
    //   headers: {
    //     accept: 'application/json',
    //     authkey: MSG91_AUTH_KEY
    //   }
    // };
    // const response = await fetch(url, options);
    // const data = await response.json();
    // if (data.type === 'error') throw new Error(data.message);

    // MOCK VERIFICATION FOR NOW
    console.log(`[MOCK MSG91] Verifying OTP ${otp} for ${phone}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (otp === '123456') {
      return NextResponse.json({ 
        success: true, 
        message: 'OTP verified successfully',
        type: 'success'
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid OTP entered. Please try again.',
        type: 'error'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP. Please try again.' }, { status: 500 });
  }
}
