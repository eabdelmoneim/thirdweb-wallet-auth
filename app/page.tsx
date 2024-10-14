'use client';

import {
  ConnectButton,
  useActiveAccount,
} from "thirdweb/react";
import { ecosystemWallet, createWallet } from "thirdweb/wallets"
import { useState } from "react";
import { createThirdwebClient } from "thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";

export default function Home() {
  const account = useActiveAccount();
  const [loggedIn, setLoggedIn] = useState(false);

  const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
  });

  const ecosystemWalletName = process.env.NEXT_PUBLIC_ECOSYSTEM_WALLET_NAME || "";
  const partnerId = process.env.NEXT_PUBLIC_PARTNER_ID || "";
  
  const ecosystemWalletInstance = ecosystemWallet(`ecosystem.${ecosystemWalletName}`, {
    partnerId: partnerId
  });

  const wallets = [
    ecosystemWalletInstance,
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
  ];

  return (
    <div>
      <ConnectButton 
        client={client} 
        wallets={wallets} 
        recommendedWallets={[ecosystemWalletInstance]}
        accountAbstraction={{
          chain: arbitrumSepolia,
          gasless: true,
        }}
        auth={{
          getLoginPayload: async (params) => {
            const response = await fetch('/api/auth/generatePayload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(params),
            });
            if (!response.ok) throw new Error('Failed to generate login payload');
            return await response.json();
          },
          doLogin: async (params) => {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(params),
            });
            if (!response.ok) throw new Error('Login failed');
            const result = await response.json();
            setLoggedIn(result.success);
          },
          isLoggedIn: async () => {
            const response = await fetch('/api/auth/isLoggedIn');
            if (!response.ok) throw new Error('Failed to check login status');
            const result = await response.json();
            return result.isLoggedIn;
          },
          doLogout: async () => {
            try {
                const response = await fetch('/api/auth/logout', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                if (response.ok) {
                  setLoggedIn(false);
                } else {
                  console.error('Logout failed');
                }
              } catch (error) {
                console.error('Error during logout:', error);
              }
          },
        }}
      />
      <pre>Connected Wallet: {account?.address}</pre>
    </div>
  );
}
