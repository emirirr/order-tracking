'use client'

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  if (loading) {
    return null; // Yüklenirken navbar'ı gösterme
  }

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-blue-400 transition-colors">
          Order Tracking
        </Link>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div className={`md:flex items-center space-x-6 ${isMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-auto mt-4 md:mt-0`}>
          {user ? (
            <> 
              {/* Admin bağlantıları */}
              {user.role === 'ADMIN' && (
                <>
                  <Link href="/dashboard" className="block md:inline-block hover:text-blue-400 transition-colors py-2 md:py-0">Dashboard</Link>
                  <Link href="/products" className="block md:inline-block hover:text-blue-400 transition-colors py-2 md:py-0">Ürünler</Link>
                  <Link href="/orders" className="block md:inline-block hover:text-blue-400 transition-colors py-2 md:py-0">Tüm Siparişler</Link>
                  <Link href="/reports" className="block md:inline-block hover:text-blue-400 transition-colors py-2 md:py-0">Raporlar</Link>
                </>
              )}

              {/* Müşteri bağlantıları */}
              {user.role === 'CUSTOMER' && (
                <>
                  <Link href="/dashboard" className="block md:inline-block hover:text-blue-400 transition-colors py-2 md:py-0">Siparişlerim</Link>
                  <Link href="/orders/new" className="block md:inline-block hover:text-blue-400 transition-colors py-2 md:py-0">Yeni Sipariş</Link>
                  <Link href="/track" className="block md:inline-block hover:text-blue-400 transition-colors py-2 md:py-0">Sipariş Takip</Link>
                </>
              )}

              {/* Üretim Sorumlusu bağlantıları */}
              {user.role === 'PRODUCTION_MANAGER' && (
                <>
                  <Link href="/dashboard" className="block md:inline-block hover:text-blue-400 transition-colors py-2 md:py-0">Üretim Paneli</Link>
                </>
              )}

              {/* Teslimatçı bağlantıları */}
              {user.role === 'DELIVERY_DRIVER' && (
                <>
                  <Link href="/dashboard" className="block md:inline-block hover:text-blue-400 transition-colors py-2 md:py-0">Teslimat Paneli</Link>
                </>
              )}

              {/* Ortak bağlantılar */}
              <span className="block md:inline-block text-gray-400 py-2 md:py-0">Merhaba, {user.name || user.email}</span>
              <button onClick={handleLogout} className="block md:inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                Çıkış Yap
              </button>
            </>
          ) : (
            <> {/* Giriş yapmamış kullanıcılar */}
              <Link href="/login" className="block md:inline-block hover:text-blue-400 transition-colors py-2 md:py-0">Giriş Yap</Link>
              <Link href="/register" className="block md:inline-block hover:text-blue-400 transition-colors py-2 md:py-0">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 