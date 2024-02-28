import * as web3 from '@solana/web3.js';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { WalletContextState, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import React, { FC, ReactComponentElement, useCallback } from 'react';

export function CreateAndSendTransaction(props: { connection: web3.Connection, wallet: WalletContextState, receiver: String; amount: number }) {

  const onClick = useCallback(async (props: { connection: web3.Connection, wallet: WalletContextState, receiver: String; amount: number }) => {
    const publicKey = props.wallet.publicKey;
    const connection = props.connection;
    const sendTransaction = props.wallet.sendTransaction;
    if (!publicKey) throw new WalletNotConnectedError();

    const lamports = props.amount*web3.LAMPORTS_PER_SOL ?? await connection.getMinimumBalanceForRentExemption(0);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new web3.PublicKey(props.receiver),
        lamports,
      })
    );

    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight }
    } = await connection.getLatestBlockhashAndContext();

    const signature = await sendTransaction(transaction, connection, { minContextSlot });

    await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

    console.log("Transaction confirmed", signature);
  }, [props.wallet.publicKey, props.wallet.sendTransaction, props.connection]);

  return (
    <button className='bg-blue-500 text-white p-2 rounded-lg' onClick={() => onClick(props)} disabled={!props.wallet.publicKey}>
      Send SOL 💸!
    </button>
  );
};