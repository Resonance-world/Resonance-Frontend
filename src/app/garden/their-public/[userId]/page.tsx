'use client';

import dynamic from 'next/dynamic';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';

// Dynamic import for better bundle splitting
const TheirPublicGarden = dynamic(
  () => import('@/components/garden/TheirPublicGarden').then(mod => ({ default: mod.TheirPublicGarden })),
  {
    loading: () => <PageLoadingSpinner text="Loading public garden..." />,
    ssr: false // Disable SSR to prevent hydration issues
  }
);

export default function TheirPublicGardenPage() {
  return <TheirPublicGarden />;
}
