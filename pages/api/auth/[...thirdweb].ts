import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";

// NOTE: This users map is for demo purposes. Its used to show the power of
// what you can accomplish with the Auth callbacks. In a production app,
// you would want to store this data somewhere externally, like a database or
// on-chain, as this in-memory map wont persist across requests.
const users: Record<string, any> = {};

console.log("inside Auth");

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  domain: "example.com",
  wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || ""),
  });

export default ThirdwebAuthHandler();
