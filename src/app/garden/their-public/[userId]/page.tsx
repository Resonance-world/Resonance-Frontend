import dynamic from 'next/dynamic';

// Dynamic import for better bundle splitting
const TheirPublicGarden = dynamic(
  () => import('@/components/garden/TheirPublicGarden').then(mod => ({ default: mod.TheirPublicGarden })),
  {
    loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>,
    ssr: false
  }
);

export default function TheirPublicGardenPage() {
  return <TheirPublicGarden />;
}
