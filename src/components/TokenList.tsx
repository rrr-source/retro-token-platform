import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MagnifyingGlass, ArrowUp, ArrowDown, Coins, ChartLine, Users, SquaresFour, List } from '@phosphor-icons/react';

interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  description: string;
  image: string;
  createdAt: string;
}

type SortOption = 'newest' | 'oldest' | 'price-high' | 'price-low' | 'market-cap';
type ViewMode = 'grid' | 'list';

const TokenList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [marketCapRange, setMarketCapRange] = useState<[number, number]>([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);

  const [tokens] = useState<Token[]>([
    {
      id: '1',
      name: 'RetroGame Token',
      symbol: 'RGT',
      price: 0.15,
      priceChange: 5.2,
      marketCap: 150000,
      volume24h: 25000,
      holders: 156,
      description: 'The ultimate gaming token for retro enthusiasts',
      image: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=RetroGame&backgroundColor=b967ff',
      createdAt: '2024-02-15',
    },
    {
      id: '2',
      name: 'Pixel Coin',
      symbol: 'PIX',
      price: 0.25,
      priceChange: -2.1,
      marketCap: 250000,
      volume24h: 35000,
      holders: 89,
      description: 'Powering the pixel art revolution',
      image: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelCoin&backgroundColor=01cdfe',
      createdAt: '2024-02-10',
    },
    {
      id: '3',
      name: 'Arcade Token',
      symbol: 'ARC',
      price: 0.45,
      priceChange: 8.7,
      marketCap: 450000,
      volume24h: 55000,
      holders: 234,
      description: 'The currency of classic arcade gaming',
      image: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Arcade&backgroundColor=ff71ce',
      createdAt: '2024-02-01',
    },
  ]);

  const sortTokens = (tokens: Token[]) => {
    switch (sortBy) {
      case 'newest':
        return [...tokens].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return [...tokens].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'price-high':
        return [...tokens].sort((a, b) => b.price - a.price);
      case 'price-low':
        return [...tokens].sort((a, b) => a.price - b.price);
      case 'market-cap':
        return [...tokens].sort((a, b) => b.marketCap - a.marketCap);
      default:
        return tokens;
    }
  };

  const filteredTokens = sortTokens(
    tokens.filter(token => 
      (token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       token.symbol.toLowerCase().includes(searchQuery.toLowerCase())) &&
      token.price >= priceRange[0] &&
      token.price <= priceRange[1] &&
      token.marketCap >= marketCapRange[0] &&
      token.marketCap <= marketCapRange[1]
    )
  );

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filteredTokens.map((token) => (
        <Link 
          key={token.id}
          to={`/token/${token.id}`}
          className="group"
        >
          <motion.div
            className="h-full bg-black/40 backdrop-blur-sm border-2 border-neon-purple rounded-lg overflow-hidden transition-all duration-300 hover:border-neon-pink hover:shadow-[0_0_15px_theme(colors.neon-pink)] group-hover:-translate-y-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative h-36 sm:h-48 bg-gradient-to-b from-black/0 to-black/60">
              <img 
                src={token.image} 
                alt={token.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-press-start text-white mb-1">
                  {token.name}
                </h3>
                <span className="text-xs sm:text-sm font-press-start text-neon-pink">
                  {token.symbol}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs sm:text-sm text-white/60 line-clamp-2">
                  {token.description}
                </div>
                <div className={`flex items-center gap-1 text-xs sm:text-sm font-press-start ${token.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {token.priceChange >= 0 ? <ArrowUp weight="bold" /> : <ArrowDown weight="bold" />}
                  {Math.abs(token.priceChange)}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <div className="text-white/60 text-[10px] sm:text-xs">Price</div>
                  <div className="text-neon-blue font-press-start text-xs sm:text-sm">
                    ${token.price.toFixed(2)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-white/60 text-[10px] sm:text-xs">Market Cap</div>
                  <div className="text-neon-blue font-press-start text-xs sm:text-sm">
                    ${token.marketCap.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neon-purple/30">
                <div className="flex flex-col items-center gap-1">
                  <Coins className="text-neon-purple w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs text-white/60">Volume</span>
                  <span className="text-[10px] sm:text-xs font-press-start">${(token.volume24h / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Users className="text-neon-purple w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs text-white/60">Holders</span>
                  <span className="text-[10px] sm:text-xs font-press-start">{token.holders}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ChartLine className="text-neon-purple w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs text-white/60">Chart</span>
                  <span className="text-[10px] sm:text-xs font-press-start">View</span>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-neon-purple">
            <th className="px-6 py-4 text-left">Token</th>
            <th className="px-6 py-4 text-right">Price</th>
            <th className="px-6 py-4 text-right">24h Change</th>
            <th className="px-6 py-4 text-right">Market Cap</th>
            <th className="px-6 py-4 text-right">Volume (24h)</th>
            <th className="px-6 py-4 text-right">Holders</th>
          </tr>
        </thead>
        <tbody>
          {filteredTokens.map((token) => (
            <motion.tr
              key={token.id}
              className="border-b border-neon-purple/20 hover:bg-neon-purple/10 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <td className="px-6 py-4">
                <Link to={`/token/${token.id}`} className="flex items-center gap-4">
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-10 h-10 rounded-lg"
                  />
                  <div>
                    <div className="font-press-start text-sm text-white">
                      {token.name}
                    </div>
                    <div className="text-xs text-neon-pink">
                      {token.symbol}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4 text-right font-press-start text-sm">
                ${token.price.toFixed(2)}
              </td>
              <td className={`px-6 py-4 text-right font-press-start text-sm ${
                token.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                <div className="flex items-center justify-end gap-1">
                  {token.priceChange >= 0 ? <ArrowUp /> : <ArrowDown />}
                  {Math.abs(token.priceChange)}%
                </div>
              </td>
              <td className="px-6 py-4 text-right font-press-start text-sm">
                ${token.marketCap.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-right font-press-start text-sm">
                ${token.volume24h.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-right font-press-start text-sm">
                {token.holders.toLocaleString()}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 px-4 sm:px-6 md:px-8"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-sm border-2 border-neon-purple rounded-lg p-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-press-start text-neon-purple mb-2">
              All Tokens
            </h2>
            <p className="text-white/60 text-xs sm:text-sm">
              Discover and explore retro-themed tokens
            </p>
          </div>
          <div className="flex gap-2 border-2 border-neon-purple rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-neon-purple text-white'
                  : 'bg-black/40 text-white/60 hover:text-white hover:bg-neon-purple/20'
              }`}
              aria-label="Grid view"
            >
              <SquaresFour size={24} weight="bold" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-colors ${
                viewMode === 'list'
                  ? 'bg-neon-purple text-white'
                  : 'bg-black/40 text-white/60 hover:text-white hover:bg-neon-purple/20'
              }`}
              aria-label="List view"
            >
              <List size={24} weight="bold" />
            </button>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border-2 border-neon-purple rounded-lg p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 bg-black/40 border-2 border-neon-purple rounded-lg text-white placeholder-white/50 font-press-start text-xs sm:text-sm focus:outline-none focus:border-neon-pink"
              />
              <MagnifyingGlass className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
            </div>

            <div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full px-3 sm:px-4 py-2 bg-black/40 border-2 border-neon-purple rounded-lg text-white font-press-start text-xs sm:text-sm hover:border-neon-pink transition-colors flex items-center justify-between"
              >
                <span>Filters & Sort</span>
                <motion.span
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </button>

              <motion.div
                initial={false}
                animate={{ height: showFilters ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 sm:pt-6 space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-press-start text-white/80 mb-2">
                      Sort By
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      {[
                        { value: 'newest', label: 'Newest First' },
                        { value: 'oldest', label: 'Oldest First' },
                        { value: 'price-high', label: 'Highest Price' },
                        { value: 'price-low', label: 'Lowest Price' },
                        { value: 'market-cap', label: 'Market Cap' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value as SortOption)}
                          className={`px-2 sm:px-4 py-2 border-2 rounded-lg font-press-start text-[10px] sm:text-xs transition-colors ${
                            sortBy === option.value
                              ? 'border-neon-pink bg-neon-pink/10 text-white'
                              : 'border-neon-purple/50 text-white/60 hover:border-neon-purple'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-press-start text-white/80 mb-2">
                      Price Range (USD)
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        min={0}
                        className="w-full px-3 sm:px-4 py-2 bg-black/40 border-2 border-neon-purple rounded-lg text-white font-press-start text-xs sm:text-sm focus:outline-none focus:border-neon-pink"
                        placeholder="Min"
                      />
                      <span className="text-white/60 text-xs sm:text-sm">to</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        min={0}
                        className="w-full px-3 sm:px-4 py-2 bg-black/40 border-2 border-neon-purple rounded-lg text-white font-press-start text-xs sm:text-sm focus:outline-none focus:border-neon-pink"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-press-start text-white/80 mb-2">
                      Market Cap Range (USD)
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <input
                        type="number"
                        value={marketCapRange[0]}
                        onChange={(e) => setMarketCapRange([Number(e.target.value), marketCapRange[1]])}
                        min={0}
                        className="w-full px-3 sm:px-4 py-2 bg-black/40 border-2 border-neon-purple rounded-lg text-white font-press-start text-xs sm:text-sm focus:outline-none focus:border-neon-pink"
                        placeholder="Min"
                      />
                      <span className="text-white/60 text-xs sm:text-sm">to</span>
                      <input
                        type="number"
                        value={marketCapRange[1]}
                        onChange={(e) => setMarketCapRange([marketCapRange[0], Number(e.target.value)])}
                        min={0}
                        className="w-full px-3 sm:px-4 py-2 bg-black/40 border-2 border-neon-purple rounded-lg text-white font-press-start text-xs sm:text-sm focus:outline-none focus:border-neon-pink"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setSortBy('newest');
                        setPriceRange([0, 1000]);
                        setMarketCapRange([0, 1000000]);
                      }}
                      className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-black/40 border-2 border-neon-blue text-white font-press-start text-xs sm:text-sm rounded-lg hover:bg-neon-blue/10 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? <GridView /> : <ListView />}

      {filteredTokens.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-white/60 font-press-start text-xs sm:text-sm">No tokens found</p>
        </div>
      )}
    </motion.div>
  );
};

export default TokenList;