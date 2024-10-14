import { NextApiRequest, NextApiResponse } from 'next';
import { VerifyLoginPayloadParams, createAuth } from "thirdweb/auth";
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (req.query.action === 'generatePayload') {
      const payload = await thirdwebAuth.generatePayload(req.body);
      res.status(200).json(payload);
    } else if (req.query.action === 'login') {
      const verifiedPayload = await thirdwebAuth.verifyPayload(req.body as VerifyLoginPayloadParams);
      if (verifiedPayload.valid) {
        const jwt = await thirdwebAuth.generateJWT({
          payload: verifiedPayload.payload,
        });
        res.setHeader('Set-Cookie', `jwt=${jwt}; HttpOnly; Path=/; SameSite=Strict`);
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, message: 'Invalid payload' });
      }
    } else if (req.query.action === 'logout') {
      res.setHeader('Set-Cookie', 'jwt=; HttpOnly; Path=/; Max-Age=0');
      res.status(200).json({ success: true });
    }
  } else if (req.method === 'GET' && req.query.action === 'isLoggedIn') {
    const jwt = req.cookies.jwt;
    if (!jwt) {
      res.status(200).json({ isLoggedIn: false });
      return;
    }
    const authResult = await thirdwebAuth.verifyJWT({ jwt });
    res.status(200).json({ isLoggedIn: authResult.valid });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
