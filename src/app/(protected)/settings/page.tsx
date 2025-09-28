'use client';

import { useSession } from 'next-auth/react';
import { useUser } from '@/hooks/useUser';

/**
 * Settings/Account page matching the design from the image
 * Shows user info, support options, about, and invite friends
 */
export default function SettingsPage() {
  const { data: session } = useSession();
  const { user, loading } = useUser();

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--resonance-dark-bg)'}}>
      {/* Page Title */}
      <div className="p-4 pt-20">
        <h1 className="text-white text-2xl font-bold text-center">Account</h1>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-6">
        {/* INFO Section */}
        <div>
          <h2 className="text-white/80 text-sm font-medium mb-3 uppercase tracking-wide">INFO</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">World ID</span>
              <span className="text-white text-sm">{user?.username || session?.user?.username || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Wallet</span>
              <span className="text-white text-sm">@{user?.walletAddress || session?.user?.walletAddress || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* SUPPORT Section */}
        <div>
          <h2 className="text-white/80 text-sm font-medium mb-3 uppercase tracking-wide">SUPPORT</h2>
          <button 
            onClick={() => window.open('https://t.me/+sgA-wVDDXIdhOWYx', '_blank')}
            className="w-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 flex justify-between items-center hover:bg-white/15 transition-colors"
          >
            <span className="text-white text-sm">Contact Us on Telegram</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* ABOUT Section */}
        <div>
          <h2 className="text-white/80 text-sm font-medium mb-3 uppercase tracking-wide">ABOUT</h2>
          <button 
            onClick={() => window.open('https://www.resonances.world', '_blank')}
            className="w-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 flex justify-between items-center hover:bg-white/15 transition-colors"
          >
            <span className="text-white text-sm">About us</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* INVITE FRIENDS Section */}
        <div>
          <h2 className="text-white/80 text-sm font-medium mb-3 uppercase tracking-wide">INVITE FRIENDS</h2>
          <button className="w-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 flex justify-between items-center hover:bg-white/15 transition-colors">
            <span className="text-white text-sm">Invite friend</span>
            <span className="text-white/70 text-sm">Coming Soon</span>
          </button>
        </div>
      </div>
    </div>
  );
}
