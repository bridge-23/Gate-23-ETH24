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
      const ethAddress = await nft_minter_backend.eth_address();
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
        <img src="/logo2.svg" alt="DFINITY logo" className="mx-auto h-12 w-auto" />
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Enter your name:</label>
            <input id="name" type="text" className="mt-1 p-2 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Click me!
          </button>
        </form>
        <button onClick={handleLogin} id="login" className="mt-4 w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Log me in
        </button>
        <div id="principalId" className="mt-4 p-4 bg-gray-700 rounded-lg">Your PrincipalId: {principalId}</div>
        <section id="greeting" className="mt-4 text-lg font-semibold">{greeting}</section>
        {principalId && <UploadNFT />}
      </div>
    </main>
  );
}

export default App;
