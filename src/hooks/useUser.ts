import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { userService, UserProfile, UpdateProfileData } from '@/services/userService';

export function useUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userData = await userService.getProfile(session);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: UpdateProfileData) => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userService.updateProfile(session, data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      console.error('Error updating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = () => {
    fetchUser();
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUser();
    } else if (status === 'unauthenticated') {
      setUser(null);
      setError(null);
    }
  }, [session, status]);

  return {
    user,
    loading,
    error,
    updateUser,
    refreshUser,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading'
  };
}

export function useUserById(userId: string | null) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const userData = await userService.getUserById(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
        console.error('Error fetching user by ID:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}
