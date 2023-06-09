import type { AppProps } from "next/app";
import { ThirdwebProvider, coinbaseWallet, metamaskWallet } from "@thirdweb-dev/react";

// This is the chain your dApp will work on.
const activeChain = "ethereum";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      supportedWallets={[metamaskWallet(), coinbaseWallet()]}
      authConfig={{
        domain: "example.com",
        authUrl: "/api/auth",
      }}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
