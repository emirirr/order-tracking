import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
<<<<<<< HEAD
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
=======
import FirebaseAnalytics from '@/components/FirebaseAnalytics'
import { AuthProvider } from '@/context/AuthContext'
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Global Sipariş Takip Sistemi",
  description: "Siparişlerinizi dünyanın her yerinden takip edin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
<<<<<<< HEAD
          <Navbar />
=======
          <FirebaseAnalytics />
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
