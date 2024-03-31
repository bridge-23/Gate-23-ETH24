import React, { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { nft_minter_backend } from 'declarations/nft_minter_backend';
import UploadNFT from './services/UploadNFT';

function App() {
  const [greeting, setGreeting] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [principalId, setPrincipalId] = useState('');

  useEffect(() => {
    (async () => {
      const ethAddress = await nft_minter_backend.get_canister_addr();
      setEthAddress(ethAddress);
      console.log(ethAddress);

      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        handleSuccess(authClient);
      }
    })();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const greeting = await nft_minter_backend.greet(name);
    setGreeting(greeting);
  }

  async function handleLogin() {
    const authClient = await AuthClient.create();
    authClient.login({
      onSuccess: () => handleSuccess(authClient),
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
        <button onClick={handleLogin} id="login" className="mt-4 w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Login
        </button>
        <div id="principalId" className="mt-4 p-4 bg-gray-700 rounded-lg">Your PrincipalId: {principalId}</div>
        {principalId && <UploadNFT />}
        { `ETH address: 0x${ethAddress.Ok}`}
      </div>
    </main>
  );
}

export default App;
