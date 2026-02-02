'use client';

import { useMemoFirebase, useUser, useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';

export interface UserProfile {
  email: string;
  role: 'admin' | 'user';
}

export interface UseUserWithRoleResult {
  user: import('firebase/auth').User | null;
  profile: UserProfile | null;
  isUserLoading: boolean;
  isProfileLoading: boolean;
  error: Error | null;
}

export function useUserWithRole(): UseUserWithRoleResult {
  const { user, isUserLoading, userError } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useDoc<UserProfile>(userProfileRef);

  return {
    user,
    profile,
    isUserLoading,
    isProfileLoading,
    error: userError || profileError,
  };
}
