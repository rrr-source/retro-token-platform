import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { House, PlusCircle, Coins, ChartLine, Info, Question, SignOut } from '@phosphor-icons/react';
import { WalletMultiButton } from '../contexts/WalletContext';
import { useWallet } from '@solana/wallet-adapter-react';

interface NavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon: typeof House;
}

const NavLink = ({ to, children, icon: Icon }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;
      }}
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
        "text-sm no-underline hover:bg-neon-purple/20",
        isActive 
          ? "text-neon-pink bg-neon-purple/10 border-r-4 border-neon-pink" 
          : "text-white/70 hover:text-white"
      )}
    >
      <Icon size={20} />
      {children}
    </Link>
  );
};

const Navbar = ({ isOpen, onClose }: NavbarProps) => {
  const { disconnect, connected } = useWallet();

  const handleLogout = () => {
    disconnect();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile navbar */}
      <motion.nav 
        className={clsx(
          "fixed top-0 bottom-0 left-0 w-[280px] bg-black/90 backdrop-blur-md z-50",
          "flex flex-col border-r-2 border-neon-purple",
          "md:hidden", // Hide on desktop
          isOpen ? "translate-x-0" : "-translate-x-full" // Show/hide based on isOpen prop
        )}
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <Link 
          to="/" 
          className="p-8 text-2xl text-neon-pink font-bold uppercase neon-text text-center"
          onClick={onClose}
        >
          RetroToken
        </Link>
        
        <div className="flex-1 px-4 py-6 space-y-2">
          <NavLink to="/" icon={House}>Home</NavLink>
          <NavLink to="/create" icon={PlusCircle}>Create Token</NavLink>
          <NavLink to="/tokens" icon={Coins}>All Tokens</NavLink>
          <NavLink to="/dashboard" icon={ChartLine}>Dashboard</NavLink>
          <NavLink to="/about" icon={Info}>About</NavLink>
          <NavLink to="/faq" icon={Question}>FAQ</NavLink>
        </div>

        <div className="p-6 border-t border-neon-purple/30 space-y-4">
          <WalletMultiButton className="w-full retro-button text-xs" />
          {connected && (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 border-2 border-red-500 rounded-lg hover:bg-red-500/30 transition-colors font-press-start text-xs"
            >
              <SignOut size={16} />
              Logout
            </button>
          )}
        </div>
      </motion.nav>

      {/* Desktop navbar */}
      <motion.nav 
        className={clsx(
          "hidden md:flex fixed top-0 left-0 h-screen w-[280px] bg-black/90 backdrop-blur-md z-50",
          "flex-col border-r-2 border-neon-purple"
        )}
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <Link 
          to="/" 
          className="p-8 text-2xl text-neon-pink font-bold uppercase neon-text text-center"
        >
          RetroToken
        </Link>
        
        <div className="flex-1 px-4 py-6 space-y-2">
          <NavLink to="/" icon={House}>Home</NavLink>
          <NavLink to="/create" icon={PlusCircle}>Create Token</NavLink>
          <NavLink to="/tokens" icon={Coins}>All Tokens</NavLink>
          <NavLink to="/dashboard" icon={ChartLine}>Dashboard</NavLink>
          <NavLink to="/about" icon={Info}>About</NavLink>
          <NavLink to="/faq" icon={Question}>FAQ</NavLink>
        </div>

        <div className="p-6 border-t border-neon-purple/30 space-y-4">
          <WalletMultiButton className="w-full retro-button text-xs" />
          {connected && (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 border-2 border-red-500 rounded-lg hover:bg-red-500/30 transition-colors font-press-start text-xs"
            >
              <SignOut size={16} />
              Logout
            </button>
          )}
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;