'use client';

import { useState } from 'react';
import { X, Heart, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Match = () => {
  const [isMatchOpen, setIsMatchOpen] = useState(false);

  const handleLike = () => {
    setIsMatchOpen(true);
  };
  const closeModal = () => {
    setIsMatchOpen(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50" data-cy="match-page">
      <div className="border-b bg-white">
        <div className="max-w-full mx-auto px-4 h-14 flex items-center justify-between" data-cy="logo-container">
          <div className="flex items-center gap-1">
            <Image src={`/img/logo.svg`} alt="Tinder logo" width={40} height={40} className="w-[24px] h-[28px]" />
            <span className="text-xl font-semibold">tinder</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-400" data-cy="messages-icon">
              <MessageSquare className="w-6 h-6" />
            </button>
            <img src="/my-profile.jpg" alt="Profile" className="w-8 h-8 rounded-full" data-cy="profile-picture" />
          </div>
        </div>
      </div>

      <main className="flex-1 p-4" data-cy="main-content">
        <div className="max-w-md mx-auto pt-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden" data-cy="profile-card">
            <div className="relative">
              <img src="/profile-image.jpg" alt="Profile" className="w-full h-[500px] object-cover" data-cy="profile-image" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white" data-cy="profile-info">
                <h2 className="text-2xl font-semibold" data-cy="profile-name">
                  Mark, 40
                </h2>
                <p className="text-lg" data-cy="profile-bio">
                  Software Engineer Facebook
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-6" data-cy="action-buttons">
            <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-lg hover:scale-110 transition-transform border" data-cy="dislike-button">
              <X className="w-7 h-7 text-red-500" />
            </button>

            <button onClick={handleLike} className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-lg hover:scale-110 transition-transform border" data-cy="like-button">
              <Heart className="w-7 h-7 text-green-500" />
            </button>
          </div>
        </div>
      </main>

      {isMatchOpen && (
        <Dialog open={isMatchOpen} onOpenChange={closeModal} data-cy="match-modal">
          <DialogContent className="sm:max-w-md">
            <div className="space-y-6" data-cy="modal-content">
              <div className="text-center" data-cy="modal-header">
                <h3 className="text-2xl font-semibold text-pink-500">It's a Match!</h3>
                <p className="text-gray-600">You matched with Baatarvan</p>
              </div>

              <div className="flex justify-center gap-4" data-cy="match-images">
                <img src="/my-profile.jpg" alt="Your profile" className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
                <img src="/baatarvan.jpg" alt="Baatarvan" className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
              </div>

              <div className="space-y-4" data-cy="modal-footer">
                <Input placeholder="Say something nice" className="w-full" data-cy="message-input" />
                <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white" data-cy="send-button">
                  Send
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Match;
