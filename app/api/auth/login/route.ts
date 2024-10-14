import { NextRequest, NextResponse } from 'next/server';
import { VerifyLoginPayloadParams } from "thirdweb/auth";
import { thirdwebAuth } from "../../../lib/auth";

// ... (same setup as generatePayload)

export async function POST(request: NextRequest) {
  const body = await request.json();
  const verifiedPayload = await thirdwebAuth.verifyPayload(body as VerifyLoginPayloadParams);
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    const response = NextResponse.json({ success: true });
    response.cookies.set('jwt', jwt, { httpOnly: true, path: '/', sameSite: 'strict' });
    return response;
  } else {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}
