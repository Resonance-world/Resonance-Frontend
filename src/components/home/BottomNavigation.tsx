'use client';

import Link from 'next/link';

interface BottomNavigationProps {
  currentPage: 'living-room' | 'circles' | 'garden';
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
      name: 'Living room',
      href: '/home',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/>
          <path d="M21 12L12 3L3 12"/>
        </svg>
      )
    },
    {
      id: 'circles',
      name: 'Circles',
      href: '/circles',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="6"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      )
    },
    {
      id: 'garden',
      name: 'Garden',
      href: '/garden',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a3 3 0 0 0-3 3c0 1.5.5 2.5 1.5 3.5L12 10l1.5-1.5c1-1 1.5-2 1.5-3.5a3 3 0 0 0-3-3"/>
          <path d="M12 10v12"/>
          <path d="M8 16s-1 1-1 3 1 3 1 3h8s1-1 1-3-1-3-1-3"/>
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 innerview-bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`innerview-nav-item ${currentPage === item.id ? 'active' : ''}`}
        >
          <div className="mb-1">
            {item.icon}
          </div>
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
}; 