import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X, Send } from 'lucide-react';
import { MatchProfile } from '../../generated';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedProfile: MatchProfile | null;
  onSendMessage: (message: string) => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  onClose,
  matchedProfile,
  onSendMessage
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!matchedProfile) return null;

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-3xl p-8 max-w-md w-full mx-4 text-center overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.5
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sparkle icons */}
            <div className="absolute top-4 right-16 flex gap-2">
              <motion.div
                className="text-white text-xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                ✨
              </motion.div>
              <motion.div
                className="text-white text-xl"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
              >
                ✨
              </motion.div>
            </div>

            {/* Match Title */}
            <motion.h2
              className="text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              IT'S A <span className="text-5xl">match</span>
            </motion.h2>

            <motion.p
              className="text-white text-lg mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              You matched with {matchedProfile.name}
            </motion.p>

            {/* Profile Images */}
            <motion.div
              className="flex justify-center items-center gap-4 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Current user profile (placeholder) */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                You
              </div>

              {/* Heart icon */}
              <motion.div
                className="text-3xl text-white"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Heart className="w-10 h-10 fill-current" />
              </motion.div>

              {/* Matched profile */}
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                <img
                  src={matchedProfile.images?.[0] || "https://via.placeholder.com/80x80"}
                  alt={matchedProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Message Input */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Say something nice!"
                  className="flex-1 px-4 py-3 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  disabled={isSending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isSending}
                  className="px-4 py-3 bg-white text-green-600 rounded-full font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isSending ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Emoji Quick Reply Buttons */}
            <motion.div
              className="flex justify-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {['👋', '😉', '❤️', '🥰'].map((emoji, index) => (
                <motion.button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>


            {/* Floating hearts animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-white/30 text-2xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    y: 0
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [-20, -100]
                  }}
                  transition={{
                    delay: 1 + i * 0.2,
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 4
                  }}
                >
                  💚
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};