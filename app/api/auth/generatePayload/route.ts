import { NextRequest, NextResponse } from 'next/server';
import { thirdwebAuth } from "../../../lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const payload = await thirdwebAuth.generatePayload(body);
  return NextResponse.json(payload);
}
