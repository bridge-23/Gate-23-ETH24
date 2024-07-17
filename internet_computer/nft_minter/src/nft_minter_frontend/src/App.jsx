import React, { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { nft_minter_backend } from "declarations/nft_minter_backend";
import UploadNFT from "./services/UploadNFT";

function App() {
  const [ethAddress, setEthAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [principalId, setPrincipalId] = useState("");

  useEffect(() => {
    if (principalId) {
      (async () => {
        const evmAddress = await nft_minter_backend.get_evm_address(principalId);
        setEthAddress(evmAddress);
        const evmBalance = await nft_minter_backend.get_base_eth_balance(evmAddress);
        if(evmBalance[1] == "")
          setEthBalance((evmBalance[0]/1000000000000000000n).toString());
        else
          setEthBalance(evmBalance[1]);
      })();
    }
  }, [principalId]);

  async function handleLogin() {
    const authClient = await AuthClient.create();
    const APP_NAME = "NFID example";
    const APP_LOGO = "https://nfid.one/icons/favicon-96x96.png";
    const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;

    const identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`;
    // const identityProvider = "https://identity.ic0.app";
    authClient.login({
      identityProvider,
      onSuccess: async () => {
        handleSuccess(authClient);
      },
      windowOpenerFeatures: `
        left=${window.screen.width / 2 - 525 / 2},
        top=${window.screen.height / 2 - 705 / 2},
        toolbar=0,location=0,menubar=0,width=525,height=705
        `,
    });
  }

  function handleSuccess(authClient) {
    const principalId = authClient.getIdentity().getPrincipal().toText();
    setPrincipalId(principalId);
  }

  return (
    <main className="min-h-screen bg-black p-4">
      <div className="max-w-xl mx-auto bg-gray-800 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold">GTE23 POS</h1>
        <button
          onClick={handleLogin}
          id="login"
          className="mt-4 w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Login
        </button>
        <div id="principalId" className="mt-4 p-4 bg-gray-700 rounded-lg">
          <b>Your Principal Id:</b> {principalId}
        </div>
        {principalId && <UploadNFT principal={principalId} />}
        {`ETH Address: ${ ethAddress ? ethAddress : principalId ? 'Detecting...' : '' }`}
        <br/>
        {`ETH Balance: ${ ethBalance ? ethBalance : principalId ? 'Detecting...' : '' }`}
      </div>
    </main>
  );
}

export default App;
