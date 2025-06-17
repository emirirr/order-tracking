<<<<<<< HEAD
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            role: userData.role || 'CUSTOMER', // Default to CUSTOMER if role not found
          });
        } else {
          // If user document doesn't exist, default to customer
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            role: 'CUSTOMER',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
=======
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

interface User {
  uid: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Firestore'dan rolü çek
        const q = query(collection(db, 'users'), where('uid', '==', firebaseUser.uid))
        const querySnapshot = await getDocs(q)
        let userData: User | null = null
        querySnapshot.forEach((doc) => {
          userData = {
            uid: firebaseUser.uid,
            name: doc.data().name,
            email: doc.data().email,
            role: doc.data().role
          }
        })
        setUser(userData)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
<<<<<<< HEAD
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
=======
  )
}

export function useAuth() {
  return useContext(AuthContext)
} 
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
