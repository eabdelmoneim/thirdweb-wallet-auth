import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY || "";

if (!privateKey) {
  throw new Error("Missing THIRDWEB_ADMIN_PRIVATE_KEY in .env file.");
}

const client = createThirdwebClient({
  secretKey: privateKey,
});

const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
  adminAccount: privateKeyToAccount({ client, privateKey }),
  client: client,
});

export const GET = async (request: NextRequest) => {
  const cookieStore = cookies();
  const jwt = cookieStore.get('jwt')?.value;
  if (!jwt) {
    return NextResponse.json({ isLoggedIn: false });
  }
  try {
    const authResult = await thirdwebAuth.verifyJWT({ jwt });
    return NextResponse.json({ isLoggedIn: authResult.valid });
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return NextResponse.json({ isLoggedIn: false, error: "Failed to verify JWT" });
  }
}
