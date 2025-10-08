import dynamic from 'next/dynamic';

// Dynamic import for better bundle splitting
const TheirPrivateGarden = dynamic(
  () => import('@/components/garden/TheirPrivateGarden').then(mod => ({ default: mod.TheirPrivateGarden })),
  {
    loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>,
    ssr: false
  }
);

export default function TheirPrivateGardenPage() {
  return <TheirPrivateGarden />;
}
