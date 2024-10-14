import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  console.log('Logout POST method called');
  const response = NextResponse.json({ success: true });
  response.cookies.set('jwt', '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
};
