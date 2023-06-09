import {
  useAddress,
  useUser,
  useLogin,
  useLogout,
  useMetamask,
  ConnectWallet,
  useConnect,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

const Home: NextPage = () => {
  const address = useAddress();
  const { login } = useLogin();
  const { logout } = useLogout();
  const { user, isLoading, isLoggedIn } = useUser();

  return (
     <div>
      {isLoggedIn ? (
        <button onClick={() => logout()}>Logout</button>
      ) : address ? (
        <button onClick={() => login()}>Login</button>
      ) : (
        <ConnectWallet theme="dark"/>
      )}

      <pre>Connected Wallet: {address}</pre>
      <pre>User: {JSON.stringify(user, undefined, 2) || "N/A"}</pre>
    </div>
  );
};

export default Home;
