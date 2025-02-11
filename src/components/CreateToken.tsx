// Full modified CreateToken.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Clipboard, Check, ArrowUp } from '@phosphor-icons/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '../contexts/WalletContext';
import { WebBundlr } from '@bundlr-network/client';
import BigNumber from 'bignumber.js';

// ---------------------- UMI Imports ----------------------
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey as umiPublicKey } from '@metaplex-foundation/umi';

import { generateSigner, percentAmount, some } from '@metaplex-foundation/umi';

import { web3JsRpc } from '@metaplex-foundation/umi-rpc-web3js';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { createMetadataAccountV3 } from '@metaplex-foundation/mpl-token-metadata';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
// (defaultPlugins is included in the default bundle)
import type { CreatorArgs } from '@metaplex-foundation/mpl-token-metadata';
// --------------------------------------------------------
import { createTokenIfMissing, mintTokensTo, findAssociatedTokenPda, getSplAssociatedTokenProgramId } from '@metaplex-foundation/mpl-toolbox';
import { createFungible } from '@metaplex-foundation/mpl-token-metadata';
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi';
import { transactionBuilder } from '@metaplex-foundation/umi';

import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram
} from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createMintToInstruction, createInitializeMintInstruction, MINT_SIZE, TOKEN_PROGRAM_ID } from '@solana/spl-token';

/** The Metaplex Token Metadata Program ID. */
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

/** Helper function to get the Metadata PDA for a given mint. */
const getMetadataPDA = async (mint: PublicKey): Promise<PublicKey> => {
  const [pda] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  return pda;
};

/**
 * Pre-create a mint account using SPL Token instructions.
 * This builds a transaction that creates and initializes the mint account.
 * The payer (i.e. wallet's public key) is used as the mint authority.
 */
const preCreateMint = async (
  connection: Connection,
  payerPubkey: PublicKey,
  signTransaction: (tx: Transaction) => Promise<Transaction>
) => {
  const mintKey = Keypair.generate();
  const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
  const tx = new Transaction();
  tx.add(
    SystemProgram.createAccount({
      fromPubkey: payerPubkey,
      newAccountPubkey: mintKey.publicKey,
      lamports,
      space: MINT_SIZE,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  tx.add(
    createInitializeMintInstruction(
      mintKey.publicKey,
      9, // decimals
      payerPubkey, // mint authority is set to the wallet's public key
      null // no freeze authority
    )
  );
  tx.feePayer = payerPubkey;
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  // Partially sign with mintKey (which we generated in-app)
  tx.partialSign(mintKey);
  // Use the wallet adapter to sign the transaction
  const signedTx = await signTransaction(tx);
  const signature = await connection.sendRawTransaction(signedTx.serialize());
  await connection.confirmTransaction(signature, 'confirmed');
  console.log("Pre-created mint with public key:", mintKey.publicKey.toBase58());
  return mintKey;
};

const CreateToken = () => {
  const { publicKey, signTransaction, wallet, connected, connect } = useWallet();

  // When the component mounts, try to connect the wallet if not connected.
  useEffect(() => {
    if (wallet && wallet.adapter && !wallet.adapter.connected) {
      connect().catch((err) =>
        console.error('Wallet connect error in useEffect:', err)
      );
    }
  }, [wallet]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<JSX.Element | string>('');
  const [refresh, setRefresh] = useState<boolean>(false);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [initialSupply, setInitialSupply] = useState(1000);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mintKeypair, setMintKeypair] = useState<Keypair | null>(null);

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /** Upload metadata to Arweave */
  const uploadMetadataToArweave = async (metadata: any, wallet: any) => {
    try {
      if (!wallet) {
        throw new Error('❌ Wallet is not connected.');
      }
      const walletForBundlr = {
        ...wallet,
        publicKey,
        getPublicKey: () => publicKey,
        sendTransaction: async (tx: Transaction, connection: Connection, options: any) => {
          const signedTx = await signTransaction(tx);
          return connection.sendRawTransaction(signedTx.serialize());
        },
        signMessage: async (message: Uint8Array | string) => {
          const encodedMessage = message instanceof Uint8Array ? message : new TextEncoder().encode(message);
          if (wallet.adapter.signMessage) {
            const result = await wallet.adapter.signMessage(encodedMessage);
            return result && result.signature ? result.signature : result;
          }
          return await signMessageViaBackend(encodedMessage);
        },
      };

      const bundlr = new WebBundlr('https://devnet.bundlr.network', 'solana', walletForBundlr, {
        providerUrl: clusterApiUrl('devnet'),
      });
      await bundlr.ready();
      const serializedMetadata = JSON.stringify(metadata);
      const price = await bundlr.getPrice(serializedMetadata.length);
      await bundlr.fund(price);
      const metadataTx = await bundlr.upload(serializedMetadata, {
        tags: [{ name: 'Content-Type', value: 'application/json' }],
      });
      const metadataUrl = `https://arweave.net/${metadataTx.id}`;
      console.log('✅ Metadata uploaded:', metadataUrl);
      return metadataUrl;
    } catch (error: any) {
      console.error('❌ Error uploading metadata:', error);
      if (error.name === 'SendTransactionError' && typeof error.getLogs === 'function') {
        try {
          const detailedLogs = await error.getLogs();
          console.error('Detailed logs from SendTransactionError:', detailedLogs);
        } catch (logError) {
          console.error('Failed to retrieve detailed logs:', logError);
        }
      }
      return null;
    }
  };

  async function signMessageViaBackend(message: Uint8Array): Promise<Uint8Array> {
    const response = await fetch('/api/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: Array.from(message) }),
    });
    if (!response.ok) {
      throw new Error('Failed to obtain signature from backend.');
    }
    const data = await response.json();
    return new Uint8Array(data.signature);
  }

  const handleCreateToken = () => {
    if (!connected || !publicKey) {
      setError('Wallet not connected. Please connect your wallet first.');
      return;
    }
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setTokenName('');
    setTokenSymbol('');
    setDescription('');
    setInitialSupply(1000);
    setImageFile(null);
    setMintAddress(null);
    setShowForm(false);
    setSuccess('');
    setError('');
  };

  const handleMintToken = async () => {
    if (!connected || !publicKey) {
      try {
        await connect();
      } catch (err) {
        console.error("❌ Wallet connection error:", err);
        setError('Wallet connection failed.');
        return;
      }
      if (!wallet.adapter.connected || wallet.adapter.readyState !== 'Connected' || !publicKey) {
        setError('Wallet not fully connected. Please try again.');
        return;
      }
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const connection = new Connection(clusterApiUrl('devnet'), {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 30000,
      });
      // 1) Upload metadata to Arweave
      const metadata = {
        name: tokenName,
        symbol: tokenSymbol,
        description,
        image: 'https://arweave.net/Your_Actual_Image_Hash',
        seller_fee_basis_points: 500,
        external_url: 'https://your-website.com',
        attributes: [{ trait_type: 'Category', value: 'Utility Token' }],
        properties: {
          creators: [{ address: publicKey, verified: true, share: 100 }],
        },
      };
      const metadataUri = await uploadMetadataToArweave(metadata, wallet);
      if (!metadataUri) throw new Error('❌ Metadata upload failed.');

      // 2) Initialize UMI
      console.log("🟡 Initializing UMI...");
      let umi;
      try {
        const rpcUrl = clusterApiUrl('devnet');
        umi = createUmi(rpcUrl)
          .use(web3JsRpc(rpcUrl))
          .use(walletAdapterIdentity(wallet.adapter))
          .use(mplTokenMetadata())
          .use(mplToolbox());
      } catch (err) {
        console.error("❌ UMI Initialization Failed:", err);
        throw err;
      }
      if (!umi) {
        setError('❌ Failed to initialize UMI. Check console for details.');
        return;
      }

      // 3) Create a new mint using UMI’s helper for fungible tokens
      const mint = generateSigner(umi);
      const mintPublicKey = new PublicKey(mint.publicKey);

      const createFungibleTx = await createFungible(umi, {
        mint,
        name: tokenName,
        uri: metadataUri,
        sellerFeeBasisPoints: percentAmount(0),
        decimals: some(9),
      });
      const result = await createFungibleTx.sendAndConfirm(umi);
      setMintAddress(new PublicKey(mint.publicKey).toBase58());

      setSuccess(
        <div key={new Date().getTime()} className="flex flex-col items-center">
          <p className="text-green-500 text-lg font-bold">✅ Token Successfully Created!</p>
          <p className="text-sm text-gray-300">Mint Address:</p>
          <p className="text-sm text-neon-purple font-mono">{mintPublicKey.toBase58()}</p>
          <a
            href={`https://solana.fm/address/${mintPublicKey.toBase58()}/metadata?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 p-2 border border-neon-purple rounded-lg text-white hover:bg-neon-purple transition"
          >
            View on Solana Explorer
          </a>
          <button onClick={resetForm} className="mt-4 p-2 border border-neon-pink rounded-lg text-white hover:bg-neon-pink transition">
            Create Another Token
          </button>
        </div>
      );

      setShowForm(false);
      setRefresh(prev => !prev);
    } catch (err) {
      console.error("❌ [Mint Token] Error:", err);
      setError("❌ Transaction failed. Please try again.");
    } finally {
      setLoading(false);
      console.log("🔹 Mint Token process finished.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl p-8 bg-black/40 backdrop-blur-sm border-2 border-neon-purple rounded-lg flex flex-col items-center text-center">
        {!showForm ? (
          <>
            <h2 className="text-2xl font-press-start text-neon-purple mb-8">Create SPL Token</h2>
            {error && (
              <div className="p-4 mb-6 bg-red-500/20 border-2 border-red-500 rounded-lg">
                <p className="text-red-500 text-sm font-press-start">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-4 mb-6 bg-green-500/20 border-2 border-green-500 rounded-lg">
                {typeof success === "string" ? (
                  <p className="text-green-500 text-sm font-press-start">{success}</p>
                ) : (
                  success
                )}
              </div>
            )}

            <div className="w-full flex flex-col items-center mt-4">
              {connected ? (
                <div className="w-full p-3 bg-black/70 border border-neon-purple rounded-lg flex items-center justify-between gap-3">
                  <span className="text-neon-purple text-sm font-mono truncate max-w-[200px]">
                    {publicKey?.toBase58().slice(0, 6)}...{publicKey?.toBase58().slice(-4)}
                  </span>
                  <button onClick={handleCopy} className="p-2 rounded-lg border border-neon-purple hover:border-neon-pink transition">
                    {copied ? <Check size={18} className="text-green-400" /> : <Clipboard size={18} className="text-white" />}
                  </button>
                </div>
              ) : (
                <div className="grid place-items-center w-full">
                  <WalletMultiButton className="retro-button text-xs w-3/4 md:w-1/2" />
                </div>
              )}
              {connected && (
                <motion.button onClick={handleCreateToken} className="retro-button w-3/4 md:w-1/2 group mt-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <span className="flex items-center justify-center gap-2">
                    Create Token <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </motion.button>
              )}
            </div>
          </>
        ) : (
          <>
            <motion.button onClick={() => setShowForm(false)} className="retro-button w-3/4 md:w-1/2 group mt-4 mb-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <span className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
              </span>
            </motion.button>
            <div className="space-y-4 w-full">
              <input type="text" placeholder="name" className="w-full p-3 bg-black/70 border border-neon-purple rounded-lg text-white" value={tokenName} onChange={(e) => setTokenName(e.target.value)} />
              <div className="flex items-center w-full p-3 bg-black/70 border border-neon-purple rounded-lg">
                <span className="text-neon-purple pr-2">$</span>
                <input type="text" placeholder="ticker" className="flex-1 bg-transparent text-white outline-none" value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} />
              </div>
              <textarea placeholder="description" className="w-full p-3 bg-black/70 border border-neon-purple rounded-lg text-white resize-none h-24" value={description} onChange={(e) => setDescription(e.target.value)} />
              <div className="w-full p-6 bg-black/70 border border-neon-purple rounded-lg flex flex-col items-center justify-center text-white">
                <ArrowUp size={24} className="text-neon-purple mb-2" />
                <p className="text-xs">drag and drop an image or video</p>
                <label className="mt-2 cursor-pointer bg-neon-purple px-4 py-2 rounded-lg text-sm hover:bg-neon-pink transition">
                  select file <input type="file" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              <motion.button onClick={handleMintToken} className="retro-button w-3/4 md:w-1/2 group mt-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>
                {loading ? 'Creating Token...' : 'Create Coin'}
              </motion.button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CreateToken;
