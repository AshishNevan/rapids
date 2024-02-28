'use client'
import { getBalance } from "@/lib/getBalance";
import { useEffect, useState } from "react";
import { Wallet } from "./walletComponent";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CreateAndSendTransaction } from "@/app/createAndSendTransaction";
import dynamic from "next/dynamic";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const ReactUIWalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
  );
  const ReactUIWalletDisconnectButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
    { ssr: false }
  );

  const [receiver, setReceiver] = useState('')
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)

  const { connection } = useConnection();
  const wallet = useWallet();
  useEffect(() => {
    getBalance(connection, wallet).then(setBalance);
  }
  , [wallet.publicKey]);

  return (
    <>
      <header className="h-14 flex flex-row items-center justify-end p-4 gap-4 bg-blue-500">
        <ReactUIWalletMultiButtonDynamic />
        <ReactUIWalletDisconnectButtonDynamic />
      </header>
      <main className="flex min-h-screen flex-col gap-4 items-center justify-start bg-blue-400">
        <h1 className="text-black text-5xl py-24">Rapids</h1>
        <div className="grid grid-flow-row grid-cols-2 gap-2 min-h-72 justify-between items-center">
          <input className="text-grey h-12 col-span-2 bg-gray-900 rounded-lg text-center" type={"text"} value={receiver} onChange={(e) =>setReceiver(e.target.value)}/>
          <input className="text-grey h-12 col-span-1 bg-gray-900 rounded-lg text-center" type="text" value={amount} onChange={(e) =>setAmount(e.target.value)}/>
          <input className="text-grey h-12 col-span-1 bg-gray-900 rounded-lg text-center" type="number" value={balance} disabled={true} onChange={(e) =>setBalance(Number(e.target.value))}/>
          <div className="h-12 col-span-2 text-center">
            <CreateAndSendTransaction connection={connection} wallet={wallet} receiver={receiver} amount={Number(amount)} />
          </div>
        </div>
      </main>
    </> 
  );
}
