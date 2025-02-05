import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "What is RetroToken?",
      answer: "RetroToken is a platform that allows you to create and manage digital tokens inspired by retro gaming. It combines blockchain technology with nostalgic gaming elements to create unique digital assets."
    },
    {
      question: "How do I create a token?",
      answer: "Creating a token is simple! Click on the 'Create Token' button, fill in the required information like name, symbol, and supply, and follow the guided process. No coding experience is needed."
    },
    {
      question: "What makes RetroToken unique?",
      answer: "RetroToken stands out with its retro gaming theme, user-friendly interface, and focus on community. We combine nostalgia with modern technology to create a unique token creation and management experience."
    },
    {
      question: "Is there a fee for creating tokens?",
      answer: "Yes, there is a small fee for token creation to cover deployment costs. The exact amount depends on network conditions and will be displayed before confirmation."
    },
    {
      question: "Can I customize my token?",
      answer: "Absolutely! You can customize your token's name, symbol, supply, and other parameters. You can also add custom branding and description to make your token unique."
    },
    {
      question: "How can I track my token's performance?",
      answer: "Use our dashboard to track your token's performance, including price, market cap, holders, and trading volume. You can also view detailed analytics and holder statistics."
    },
    {
      question: "Is my token secure?",
      answer: "Yes, all tokens created on RetroToken are secured by blockchain technology. We implement industry-standard security practices and smart contract audits."
    },
    {
      question: "Can I trade tokens on RetroToken?",
      answer: "Currently, RetroToken focuses on token creation and management. Trading functionality will be added in future updates."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="text-center mb-12">
        <motion.h1 
          className="text-4xl font-press-start text-neon-purple mb-6 neon-text"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          FAQ
        </motion.h1>
        <motion.p
          className="text-lg text-white/80"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Frequently Asked Questions about RetroToken
        </motion.p>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border-2 border-neon-purple rounded-lg overflow-hidden bg-black/40 backdrop-blur-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neon-purple/10 transition-colors duration-300"
            >
              <span className="font-press-start text-white text-sm">
                {item.question}
              </span>
              <CaretDown 
                size={20}
                className={clsx(
                  "text-neon-purple transition-transform duration-300",
                  openIndex === index && "transform rotate-180"
                )}
              />
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-4 text-white/70 border-t border-neon-purple/30">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-12 p-8 border-2 border-neon-pink rounded-lg bg-black/40 backdrop-blur-sm"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-xl font-press-start text-neon-pink mb-4">
          Still have questions?
        </h2>
        <p className="text-white/70 mb-6">
          Contact our support team for more information
        </p>
        <button className="retro-button">
          Contact Support
        </button>
      </motion.div>
    </motion.div>
  );
};

export default FAQ;