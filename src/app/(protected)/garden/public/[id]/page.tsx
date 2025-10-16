import { PublicGarden } from '@/components/garden/PublicGarden';

interface PublicGardenPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Public Garden Page - View other users' profiles
 * Route: /garden/public/[id]
 */
export default async function PublicGardenPage({ params }: PublicGardenPageProps) {
  const { id } = await params;

  return (
    <PublicGarden 
      userId={id}
    />
  );
} 