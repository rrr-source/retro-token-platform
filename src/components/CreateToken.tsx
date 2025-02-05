import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';

const CreateToken = () => {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateToken = async () => {
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      
      // Create token with 9 decimals
      const mint = await createMint(
        connection,
        {
          publicKey,
          secretKey: new Uint8Array(32), // This is a placeholder, we'll use wallet signing
        },
        publicKey, // mint authority
        publicKey, // freeze authority
        9 // decimals
      );

      setSuccess(`Token created successfully! Mint address: ${mint.toBase58()}`);
    } catch (err) {
      console.error('Error creating token:', err);
      setError('Failed to create token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl p-8 bg-black/40 backdrop-blur-sm border-2 border-neon-purple rounded-lg">
        <h2 className="text-2xl font-press-start text-neon-purple mb-8 text-center">
          Create SPL Token
        </h2>

        {error && (
          <div className="p-4 mb-6 bg-red-500/20 border-2 border-red-500 rounded-lg">
            <p className="text-red-500 text-sm font-press-start">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="p-4 mb-6 bg-green-500/20 border-2 border-green-500 rounded-lg">
            <p className="text-green-500 text-sm font-press-start">
              {success}
            </p>
          </div>
        )}

        <motion.button
          onClick={handleCreateToken}
          className="retro-button w-full group"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            'Creating Token...'
          ) : (
            <span className="flex items-center justify-center gap-2">
              Create Token
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CreateToken;