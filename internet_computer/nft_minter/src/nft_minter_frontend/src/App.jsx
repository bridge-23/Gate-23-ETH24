import { useEffect, useState } from 'react';
import { nft_minter_backend } from 'declarations/nft_minter_backend';

function App() {
  const [greeting, setGreeting] = useState('');
  const [ethAddress, setEthAddress] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    nft_minter_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  async function fetchEthAddress() {
    const ethAddress = await nft_minter_backend.eth_address();
    setEthAddress(ethAddress);
    console.log(ethAddress);
  }

  useEffect(() => {
    fetchEthAddress();
  }, [])

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <form action="#" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <button type="submit">Click Me!</button>
      </form>
      <section id="greeting">{greeting}</section>
    </main>
  );
}

export default App;
