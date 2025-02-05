import { motion } from 'framer-motion';
import { GameController, Coins, Users, Lightning } from '@phosphor-icons/react';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <div className="text-center max-w-3xl mx-auto">
        <motion.h1 
          className="text-4xl font-press-start text-neon-purple mb-8 neon-text"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          About RetroToken
        </motion.h1>

        <motion.p
          className="text-lg mb-12 text-white/80 leading-relaxed"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          RetroToken is a revolutionary platform that brings the nostalgia of retro gaming
          to the world of digital tokens. Create, trade, and collect tokens inspired by
          the golden age of gaming.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className="p-8 bg-black/40 backdrop-blur-sm border-2 border-neon-pink rounded-lg"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GameController size={48} className="text-neon-pink mb-6" />
          <h2 className="text-xl font-press-start text-neon-pink mb-4">
            Retro Gaming Meets Web3
          </h2>
          <p className="text-white/70 leading-relaxed">
            We combine the nostalgia of retro gaming with modern blockchain technology
            to create a unique ecosystem for gamers and collectors alike.
          </p>
        </motion.div>

        <motion.div
          className="p-8 bg-black/40 backdrop-blur-sm border-2 border-neon-blue rounded-lg"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Coins size={48} className="text-neon-blue mb-6" />
          <h2 className="text-xl font-press-start text-neon-blue mb-4">
            Create Your Own Token
          </h2>
          <p className="text-white/70 leading-relaxed">
            Launch your own gaming token with custom parameters, branding, and
            tokenomics. Build a community around your retro-inspired project.
          </p>
        </motion.div>

        <motion.div
          className="p-8 bg-black/40 backdrop-blur-sm border-2 border-neon-purple rounded-lg"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Users size={48} className="text-neon-purple mb-6" />
          <h2 className="text-xl font-press-start text-neon-purple mb-4">
            Growing Community
          </h2>
          <p className="text-white/70 leading-relaxed">
            Join thousands of retro gaming enthusiasts and token creators in our
            vibrant community. Share ideas, collaborate, and grow together.
          </p>
        </motion.div>

        <motion.div
          className="p-8 bg-black/40 backdrop-blur-sm border-2 border-neon-pink rounded-lg"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Lightning size={48} className="text-neon-pink mb-6" />
          <h2 className="text-xl font-press-start text-neon-pink mb-4">
            Instant Deployment
          </h2>
          <p className="text-white/70 leading-relaxed">
            Create and deploy your token in minutes with our user-friendly interface.
            No coding experience required.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="max-w-3xl mx-auto text-center mt-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-2xl font-press-start text-neon-blue mb-6">
          Join the Revolution
        </h2>
        <p className="text-white/70 leading-relaxed mb-8">
          Be part of the next generation of gaming tokens. Create, collect, and trade
          with the power of blockchain technology and the charm of retro gaming.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default About;