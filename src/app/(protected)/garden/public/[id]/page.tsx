import { PublicGarden } from '@/components/garden/PublicGarden';
import { MOCK_PUBLIC_PROFILES } from '@/types/garden';

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
  
  // Find the profile by ID (in a real app, this would be an API call)
  const profile = MOCK_PUBLIC_PROFILES.find(p => 
    p.name.toLowerCase() === id.toLowerCase()
  ) || MOCK_PUBLIC_PROFILES[0]; // Fallback to first profile

  return (
    <PublicGarden 
      profile={profile}
    />
  );
} 