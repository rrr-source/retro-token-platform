import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChartLine, Users, ChatCircle, ArrowUp, ArrowDown, Wallet } from '@phosphor-icons/react';
import clsx from 'clsx';

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  likes: number;
}

interface Holder {
  address: string;
  balance: string;
  percentage: number;
}

const TokenDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [newComment, setNewComment] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [showSlippageSettings, setShowSlippageSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data
  const token = {
    id,
    name: 'RetroGame Token',
    symbol: 'RGT',
    price: 0.15,
    priceChange: 5.2,
    marketCap: 150000,
    volume24h: 25000,
    supply: '1000000',
    holders: 156,
  };

  const [comments] = useState<Comment[]>([
    {
      id: '1',
      user: '0x1234...5678',
      text: 'Great potential for this token!',
      timestamp: '2024-02-10 14:30',
      likes: 5,
    },
    {
      id: '2',
      user: '0x8765...4321',
      text: 'Looking forward to the upcoming features',
      timestamp: '2024-02-10 15:45',
      likes: 3,
    },
  ]);

  const [holders] = useState<Holder[]>([
    {
      address: '0x1234...5678',
      balance: '100,000',
      percentage: 10,
    },
    {
      address: '0x8765...4321',
      balance: '50,000',
      percentage: 5,
    },
  ]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    setNewComment('');
  };

  const handleAmountPreset = (value: string) => {
    setAmount(value);
  };

  const handleTrade = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Convert amount to number
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Invalid amount');
      }

      // Simulate trade
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccessMessage(`${tradeType === 'buy' ? 'Bought' : 'Sold'} ${amount} tokens`);
      setAmount('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const TabButton = ({ name, icon: Icon }: { name: string; icon: typeof ChartLine }) => (
    <button
      onClick={() => setActiveTab(name.toLowerCase())}
      className={`flex items-center gap-2 px-6 py-3 font-press-start text-sm transition-colors duration-300
        ${activeTab === name.toLowerCase()
          ? 'text-neon-pink border-b-2 border-neon-pink'
          : 'text-white/60 hover:text-white'
        }`}
    >
      <Icon size={20} />
      {name}
    </button>
  );

  const TradePanel = () => (
    <div className="w-full lg:w-[360px] bg-black/40 backdrop-blur-sm border-2 border-neon-purple rounded-lg p-6">
      <div className="flex rounded-lg overflow-hidden border-2 border-neon-purple mb-6">
        <button
          onClick={() => setTradeType('buy')}
          className={clsx(
            'flex-1 py-3 text-center font-press-start text-sm transition-colors',
            tradeType === 'buy'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-transparent text-white/60 hover:text-white'
          )}
        >
          buy
        </button>
        <button
          onClick={() => setTradeType('sell')}
          className={clsx(
            'flex-1 py-3 text-center font-press-start text-sm transition-colors',
            tradeType === 'sell'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-transparent text-white/60 hover:text-white'
          )}
        >
          sell
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white/60">
              amount
            </label>
            <button
              onClick={() => setShowSlippageSettings(!showSlippageSettings)}
              className="text-xs text-neon-purple hover:text-neon-pink transition-colors"
            >
              set max slippage
            </button>
          </div>

          {showSlippageSettings && (
            <div className="mb-4 p-4 bg-black/40 rounded-lg border border-neon-purple">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="w-20 px-2 py-1 bg-black border border-neon-purple rounded text-white text-sm"
                  step="0.1"
                  min="0.1"
                  max="100"
                />
                <span className="text-white/60 text-sm">%</span>
              </div>
              <div className="flex gap-2">
                {['0.5', '1', '2', '3'].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={clsx(
                      'px-2 py-1 text-xs rounded transition-colors',
                      slippage === value
                        ? 'bg-neon-purple text-white'
                        : 'bg-black/40 text-white/60 hover:text-white'
                    )}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-black/40 border-2 border-neon-purple rounded-lg text-white font-press-start text-lg focus:outline-none focus:border-neon-pink"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-white/60">Tokens</span>
              <Wallet className="text-neon-purple" size={20} />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleAmountPreset('100')}
              className="flex-1 px-2 py-1 bg-black/40 border border-neon-purple rounded text-white/60 hover:text-white text-sm transition-colors"
            >
              100
            </button>
            <button
              onClick={() => handleAmountPreset('500')}
              className="flex-1 px-2 py-1 bg-black/40 border border-neon-purple rounded text-white/60 hover:text-white text-sm transition-colors"
            >
              500
            </button>
            <button
              onClick={() => handleAmountPreset('1000')}
              className="flex-1 px-2 py-1 bg-black/40 border border-neon-purple rounded text-white/60 hover:text-white text-sm transition-colors"
            >
              1000
            </button>
          </div>
        </div>

        <button
          onClick={handleTrade}
          disabled={isLoading}
          className={clsx(
            'w-full py-4 rounded-lg font-press-start text-white transition-all',
            'border-2 hover:-translate-y-0.5',
            isLoading && 'opacity-50 cursor-not-allowed',
            tradeType === 'buy'
              ? 'bg-green-500/20 border-green-500 hover:bg-green-500/30'
              : 'bg-red-500/20 border-red-500 hover:bg-red-500/30'
          )}
        >
          {isLoading ? 'processing...' : 'place trade'}
        </button>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-500 text-sm">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header and main info */}
      <div className="bg-black/40 backdrop-blur-sm border-2 border-neon-purple rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-press-start text-neon-purple">
              {token.name} ({token.symbol})
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xl font-press-start text-neon-pink">
                ${token.price}
              </span>
              <span className={`flex items-center gap-1 text-sm ${token.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {token.priceChange >= 0 ? <ArrowUp /> : <ArrowDown />}
                {Math.abs(token.priceChange)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-black/20 rounded-lg">
            <p className="text-sm text-white/60 mb-2">Market Cap</p>
            <p className="text-lg font-press-start text-neon-blue">
              ${token.marketCap.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-black/20 rounded-lg">
            <p className="text-sm text-white/60 mb-2">24h Volume</p>
            <p className="text-lg font-press-start text-neon-blue">
              ${token.volume24h.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-black/20 rounded-lg">
            <p className="text-sm text-white/60 mb-2">Holders</p>
            <p className="text-lg font-press-start text-neon-blue">
              {token.holders.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="lg:flex gap-8">
        <div className="flex-1 bg-black/40 backdrop-blur-sm border-2 border-neon-purple rounded-lg mb-8 lg:mb-0">
          <div className="flex border-b border-neon-purple/30">
            <TabButton name="Overview" icon={ChartLine} />
            <TabButton name="Holders" icon={Users} />
            <TabButton name="Comments" icon={ChatCircle} />
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="aspect-[16/9] bg-black/20 rounded-lg mb-6">
                  <div className="w-full h-full flex items-center justify-center text-white/60">
                    Price Chart Coming Soon
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'holders' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neon-purple/30">
                      <th className="px-6 py-3 text-left text-sm font-press-start text-white/60">Address</th>
                      <th className="px-6 py-3 text-left text-sm font-press-start text-white/60">Balance</th>
                      <th className="px-6 py-3 text-left text-sm font-press-start text-white/60">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holders.map((holder, index) => (
                      <tr key={index} className="border-b border-neon-purple/10">
                        <td className="px-6 py-4 text-sm font-press-start text-neon-blue">
                          {holder.address}
                        </td>
                        <td className="px-6 py-4 text-sm font-press-start text-white">
                          {holder.balance}
                        </td>
                        <td className="px-6 py-4 text-sm font-press-start text-neon-pink">
                          {holder.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-6">
                <form onSubmit={handleSubmitComment} className="mb-8">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-4 bg-black border-2 border-neon-purple rounded-lg text-white font-press-start text-sm resize-none focus:outline-none focus:border-neon-pink"
                    rows={3}
                  />
                  <button
                    type="submit"
                    className="mt-2 px-6 py-2 bg-neon-purple text-white font-press-start text-sm rounded hover:bg-neon-pink transition-colors duration-300"
                  >
                    Post Comment
                  </button>
                </form>

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-press-start text-neon-blue">
                          {comment.user}
                        </span>
                        <span className="text-xs text-white/60">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-white mb-2">{comment.text}</p>
                      <div className="flex items-center gap-2">
                        <button className="text-neon-purple hover:text-neon-pink transition-colors duration-300">
                          ❤️ {comment.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trading Panel */}
        <TradePanel />
      </div>
    </motion.div>
  );
};

export default TokenDetails;