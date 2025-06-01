import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { UserRound, Instagram, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import CartModal from '@/components/cart/CartModal';
import CartButton from '@/components/cart/CartButton';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cake happy',
  description: 'Find the best cakes here!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col w-screen min-h-screen overflow-x-hidden overflow-y-auto`}
      >
        <CartModal />
        <div className="bg-cake-happy-dark w-full h-14 flex flex-row items-center px-10 py-6">
          <Link
            href="/"
            className="flex w-full justify-start items-center text-xl text-cake-happy-clean"
          >
            Cake Happy
          </Link>
          <div className="flex flex-row justify-end items-center space-x-3 text-cake-happy-dark">
            <button className="bg-cake-happy-clean p-2 rounded-full cursor-pointer">
              <UserRound />
            </button>
            <CartButton />
          </div>
        </div>
        <main className="flex flex-1 w-full px-10 py-4 container mx-auto">
          {children}
        </main>
        <div className="bg-cake-happy-dark text-cake-happy-clean w-full flex flex-row justify-between bottom-0 items-center">
          <div className="w-full flex flex-row justify-between items-center px-10 py-6 container mx-auto">
            <div className="flex flex-col space-y-3 justify-center">
              <Link href="/about-us" className="cursor-pointer">
                Sobre Nós
              </Link>
              <Link href="/politics" className="cursor-pointer">
                Politicas de privacidade
              </Link>
            </div>
            <div className="flex flex-col space-y-2 justify-center">
              <h1>Contato:</h1>
              <button className="flex flex-row space-x-2 cursor-pointer">
                <MessageCircleQuestion />
                <h2>(64) 99999-8888</h2>
              </button>
              <button className="cursor-pointer">
                <a
                  href="https://www.instagram.com/kauan.gkpa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-row space-x-2 "
                >
                  <Instagram />
                  <h2>kauan.gkpa</h2>
                </a>
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
