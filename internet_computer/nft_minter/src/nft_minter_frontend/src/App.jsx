import React, { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { nft_minter_backend } from 'declarations/nft_minter_backend';

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
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto shadow-lg rounded-lg p-6 bg-white">
        <img src="/logo2.svg" alt="DFINITY logo" className="mx-auto h-12 w-auto" />
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Enter your name:</label>
            <input id="name" type="text" className="mt-1 p-2 block w-full border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Click me!
          </button>
        </form>
        <button onClick={handleLogin} id="login" className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Log me in
        </button>
        <div id="principalId" className="mt-4 p-4 bg-gray-50 rounded-lg text-gray-700">Your PrincipalId: {principalId}</div>
        <section id="greeting" className="mt-4 text-lg font-semibold text-gray-900">{greeting}</section>
      </div>
    </main>
  );
}

export default App;
