import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { List } from '@phosphor-icons/react';
import { WalletContextProvider } from './contexts/WalletContext';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import Home from './components/Home';
import CreateToken from './components/CreateToken';
import TokenList from './components/TokenList';
import Dashboard from './components/Dashboard';
import TokenDetails from './components/TokenDetails';
import About from './components/About';
import FAQ from './components/FAQ';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <WalletContextProvider>
      <Router>
        <div className="min-h-screen w-full bg-black text-white relative">
          <div className="grid-background" />
          <AnimatePresence mode="wait">
            {isLoading ? (
              <Preloader onLoadingComplete={() => setIsLoading(false)} />
            ) : (
              <div className="flex flex-col md:flex-row min-h-screen">
                <Navbar 
                  isOpen={isMobileMenuOpen} 
                  onClose={() => setIsMobileMenuOpen(false)} 
                />
                <main className={`flex-1 transition-all duration-300 ${isMobileMenuOpen ? 'md:ml-[280px]' : 'md:ml-0'} p-4 sm:p-6 md:p-8 min-h-screen`}>
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="fixed top-4 left-4 z-[60] p-2 bg-black/80 border-2 border-neon-purple rounded-lg hover:border-neon-pink transition-colors"
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  >
                    <List size={24} weight="bold" className="text-white" />
                  </button>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<CreateToken />} />
                    <Route path="/tokens" element={<TokenList />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/token/:id" element={<TokenDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQ />} />
                  </Routes>
                </main>
              </div>
            )}
          </AnimatePresence>
        </div>
      </Router>
    </WalletContextProvider>
  );
};

export default App;