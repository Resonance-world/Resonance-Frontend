'use client';

import Link from 'next/link';

interface BottomNavigationProps {
  currentPage: 'living-room' | 'circles' | 'garden' | 'notifications';
}

/**
 * BottomNavigation - Navigation bar at bottom of screen
 * Implements the three main sections: Living room, Circles, Garden
 */
export const BottomNavigation = ({ currentPage }: BottomNavigationProps) => {
  console.log('🧭 Bottom Navigation - Current page:', currentPage);

  const navItems = [
    {
      id: 'living-room',
      name: '',
      href: '/home',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor"/>
          <rect x="6" y="9" width="2" height="2" fill="var(--resonance-dark-bg)"/>
          <rect x="10" y="9" width="2" height="2" fill="var(--resonance-dark-bg)"/>
          <rect x="14" y="9" width="2" height="2" fill="var(--resonance-dark-bg)"/>
          <rect x="6" y="13" width="2" height="2" fill="var(--resonance-dark-bg)"/>
          <rect x="10" y="13" width="2" height="2" fill="var(--resonance-dark-bg)"/>
          <rect x="14" y="13" width="2" height="2" fill="var(--resonance-dark-bg)"/>
        </svg>
      )
    },
    {
      id: 'notifications',
      name: '',
      href: '/notifications',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
          <circle cx="12" cy="12" r="6"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
      )
    },
    {
      id: 'circles',
      name: '',
      href: '/circles',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="8" height="8" rx="1"/>
          <rect x="13" y="3" width="8" height="8" rx="1"/>
          <rect x="3" y="13" width="8" height="8" rx="1"/>
          <rect x="13" y="13" width="8" height="8" rx="1"/>
        </svg>
      )
    },
    {
      id: 'garden',
      name: '',
      href: '/garden',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c-1.5 0-3 1.5-3 3.5 0 1.8 1 3.2 2.5 4L12 10l0.5-0.5c1.5-0.8 2.5-2.2 2.5-4C15 3.5 13.5 2 12 2z"/>
          <rect x="11" y="10" width="2" height="8"/>
          <path d="M8 16c0 2 1 4 4 4s4-2 4-4c0-1-1-2-2-2H10c-1 0-2 1-2 2z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 resonance-bottom-nav" style={{backgroundColor: 'var(--resonance-dark-surface)'}}>
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`resonance-nav-item ${currentPage === item.id ? 'active' : ''}`}
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
}; 