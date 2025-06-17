"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface UserData {
  uid: string;
  email: string | null;
  name: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'PRODUCTION_MANAGER' | 'DELIVERY_DRIVER';
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user role from Firestore
        const q = query(collection(db, 'users'), where('uid', '==', firebaseUser.uid));
        const querySnapshot = await getDocs(q);
        let userData: UserData | null = null;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            role: data.role || 'CUSTOMER', // Default to CUSTOMER if role not found
          };
        });

        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
