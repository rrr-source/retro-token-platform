import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative"
    >
      <div className="text-center max-w-3xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-6xl font-press-start text-neon-pink mb-8 neon-text"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Create Your Own Token
        </motion.h1>

        <motion.p
          className="text-lg mb-12 text-white/80 leading-relaxed"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Join the future of decentralized finance with our retro-styled token creation platform. 
          Build your community, earn rewards, and become part of the next generation of crypto.
        </motion.p>

        <motion.div 
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/create">
            <motion.button
              className={`
                retro-button group flex items-center gap-2
                bg-neon-purple hover:bg-neon-pink text-white
                px-8 py-4 font-press-start text-sm uppercase
                border-2 border-white transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-[0_0_15px_theme(colors.neon-pink)]
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Token
              <ArrowRight 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                weight="bold" 
              />
            </motion.button>
          </Link>

          <Link to="/about">
            <motion.button
              className={`
                retro-button group flex items-center gap-2
                bg-transparent hover:bg-neon-blue text-white
                px-8 py-4 font-press-start text-sm uppercase
                border-2 border-white transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-[0_0_15px_theme(colors.neon-blue)]
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
              <ArrowRight 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                weight="bold" 
              />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="p-6 border-2 border-neon-purple rounded-lg bg-black/40 backdrop-blur-sm">
            <h3 className="text-neon-purple font-press-start text-lg mb-4">Custom Tokens</h3>
            <p className="text-white/70">Create your own token with custom parameters and branding</p>
          </div>

          <div className="p-6 border-2 border-neon-blue rounded-lg bg-black/40 backdrop-blur-sm">
            <h3 className="text-neon-blue font-press-start text-lg mb-4">Earn Rewards</h3>
            <p className="text-white/70">Participate in the pyramid reward system and earn from referrals</p>
          </div>

          <div className="p-6 border-2 border-neon-pink rounded-lg bg-black/40 backdrop-blur-sm">
            <h3 className="text-neon-pink font-press-start text-lg mb-4">Community</h3>
            <p className="text-white/70">Join a growing community of token creators and holders</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;