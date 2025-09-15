'use client';

import { usePathname } from 'next/navigation';
import { BottomNavigation } from './BottomNavigation';

/**
 * DynamicBottomNavigation - Wrapper that determines current page from URL
 * Maps pathname to navigation currentPage prop
 */
export const DynamicBottomNavigation = () => {
  const pathname = usePathname();

  // Map pathname to navigation page IDs
  const getCurrentPage = () => {
    if (pathname.startsWith('/home')) return 'living-room';
    if (pathname.startsWith('/notifications')) return 'notifications';
    if (pathname.startsWith('/circles')) return 'circles';
    if (pathname.startsWith('/garden')) return 'garden';
    return 'living-room'; // default
  };

  return <BottomNavigation currentPage={getCurrentPage()} />;
};

