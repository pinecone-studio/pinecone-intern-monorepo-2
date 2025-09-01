import React from 'react';
import { motion } from 'framer-motion';
import { Profile } from './MockData';

export const MatchModal: React.FC<{
  profile: Profile | null;
  onKeepSwiping: () => void;
  onMessage: () => void;
}> = ({ profile, onKeepSwiping }) => {
  if (!profile) return null;
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onKeepSwiping}
    >
      <motion.div
        className="bg-gradient-to-b from-green-400 to-green-600 rounded-2xl p-8 text-center text-white relative max-w-sm w-full"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onKeepSwiping} 
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <motion.div
            className="absolute top-20 left-10 w-16 h-16 opacity-20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="text-white">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </motion.div>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-4xl font-black mb-2 leading-none">
            IT&apos;S A<br/><span className="text-5xl">match</span>
          </h1>
          <p className="text-lg mb-6 opacity-90">You matched with {profile.name}</p>
          <div className="flex justify-center mb-8">
            <img src={profile.images[0]} alt={profile.name} className="w-20 h-20 rounded-full border-4 border-white/50 object-cover"/>
          </div>
        </motion.div>
        
        <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="bg-white rounded-full px-4 py-3 flex items-center">
            <input type="text" placeholder="Say something nice!" className="flex-1 text-gray-600 text-sm bg-transparent outline-none"/>
            <button className="text-green-500 font-semibold text-sm ml-3">Send</button>
          </div>
        </motion.div>
        
        <motion.div className="flex justify-center gap-3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
          {['👋', '😊', '❤️', '😍'].map((emoji, index) => (
            <button key={index} className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-lg hover:bg-black/30 transition-colors">
              {emoji}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};