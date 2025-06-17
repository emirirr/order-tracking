
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FirebaseAnalytics from '@/components/FirebaseAnalytics'
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

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
          <Navbar />
          <FirebaseAnalytics />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
