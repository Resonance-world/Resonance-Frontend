import { auth } from '@/auth';
import { BottomNavigation } from '@/components/home/BottomNavigation';
import { FixedHeader } from '@/components/ui/FixedHeader';

export default async function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If the user is not authenticated, redirect to the login page
  if (!session) {
    console.log('Not authenticated');
    // redirect('/');
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--resonance-dark-bg)'}}>
      {/* Fixed Header */}
      <FixedHeader />
      
      {/* Main Content with proper spacing */}
      <div className="pt-16 pb-24 min-h-screen">
        {children}
      </div>
      
      {/* Fixed Bottom Navigation */}
      <BottomNavigation currentPage="living-room" />
    </div>
  );
}
