import * as web3 from '@solana/web3.js'
import { WalletContextState } from '@solana/wallet-adapter-react';

export async function getBalance(connection: web3.Connection, wallet: WalletContextState) {
  const publicKey = wallet.publicKey;
  if (!publicKey) return 0;
  const balance = await connection.getBalance(publicKey);
  return balance/web3.LAMPORTS_PER_SOL;
}