'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';

type UserRole = 'admin' | 'worker' | 'client';

type UserContextType = {
  user: any | null;
  role: UserRole;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  role: 'client',
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole>('client');
  const [loading, setLoading] = useState(true);
  
  // Initialize your specific browser client
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
  const fetchUserAndRole = async () => {
    // Only set loading to true if we don't have a user yet
    // This prevents the UI from flickering when a user is already there
    setLoading(true);
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        setUser(authUser);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .single();

        if (profile && !error) {
          setRole(profile.role as UserRole);
        }
      } else {
        // Reset if no authUser is found
        setUser(null);
        setRole('client');
      }
    } catch (err) {
      console.error("Context Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial Fetch
  fetchUserAndRole();

  // 2. Real-time Auth Listener (CRITICAL)
  // This detects when a user logs in or out and updates the UI instantly 
  // without needing a page refresh.
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      fetchUserAndRole();
    } else if (event === 'SIGNED_OUT') {
      setUser(null);
      setRole('client');
      setLoading(false);
    }
  });

  // 3. Cleanup Subscription
  // Prevents memory leaks when the component unmounts
  return () => {
    subscription.unsubscribe();
  };
}, [supabase]);

  return (
    <UserContext.Provider value={{ user, role, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);