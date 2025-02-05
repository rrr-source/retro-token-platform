import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChartLine, Coins, Users } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

interface Token {
  id: string;
  name: string;
  symbol: string;
  supply: string;
  holders: number;
  price: number;
}

const Dashboard = () => {
  const [tokens] = useState<Token[]>([
    {
      id: '1',
      name: 'RetroGame Token',
      symbol: 'RGT',
      supply: '1000000',
      holders: 156,
      price: 0.15,
    },
    {
      id: '2',
      name: 'Pixel Coin',
      symbol: 'PIX',
      supply: '500000',
      holders: 89,
      price: 0.25,
    },
  ]);

  const StatCard = ({ title, value, icon: Icon }: { title: string; value: string; icon: typeof ChartLine }) => (
    <div className="p-6 bg-black/40 backdrop-blur-sm border-2 border-neon-purple rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <Icon size={24} className="text-neon-purple" />
        <h3 className="text-sm font-press-start text-white/80">{title}</h3>
      </div>
      <p className="text-xl font-press-start text-neon-pink">{value}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-press-start text-neon-purple mb-8">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Tokens"
          value={tokens.length.toString()}
          icon={Coins}
        />
        <StatCard
          title="Total Holders"
          value={tokens.reduce((acc, token) => acc + token.holders, 0).toString()}
          icon={Users}
        />
        <StatCard
          title="Avg. Price"
          value={`$${(tokens.reduce((acc, token) => acc + token.price, 0) / tokens.length).toFixed(2)}`}
          icon={ChartLine}
        />
      </div>

      <div className="bg-black/40 backdrop-blur-sm border-2 border-neon-purple rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-press-start text-neon-blue mb-6">
            Your Tokens
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neon-purple/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-press-start text-white/80">Name</th>
                <th className="px-6 py-4 text-left text-sm font-press-start text-white/80">Symbol</th>
                <th className="px-6 py-4 text-left text-sm font-press-start text-white/80">Supply</th>
                <th className="px-6 py-4 text-left text-sm font-press-start text-white/80">Holders</th>
                <th className="px-6 py-4 text-left text-sm font-press-start text-white/80">Price</th>
                <th className="px-6 py-4 text-right text-sm font-press-start text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neon-purple/20">
              {tokens.map((token) => (
                <tr key={token.id} className="hover:bg-neon-purple/10">
                  <td className="px-6 py-4 text-sm font-press-start text-white">
                    {token.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-press-start text-neon-pink">
                    {token.symbol}
                  </td>
                  <td className="px-6 py-4 text-sm font-press-start text-white">
                    {parseInt(token.supply).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-press-start text-white">
                    {token.holders.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-press-start text-neon-blue">
                    ${token.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/token/${token.id}`}
                      className="text-neon-purple hover:text-neon-pink transition-colors duration-300"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;