import { ThirdwebProvider } from "thirdweb/react";

// This is the chain your dApp will work on.
const activeChain = "ethereum";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
