import '../globals.css';
import { UserRound, Instagram, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import CartModal from '@/components/cart/CartModal';
import CartButton from '@/components/cart/CartButton';
import TanstackProvider from '@/lib/tanstack-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`antialiased flex flex-col w-full min-h-screen overflow-x-hidden overflow-y-auto`}
    >
      <div className="w-full h-full p-3 flex flex-col flex-1">
        <div className="bg-cake-happy-dark w-full h-16 flex flex-row items-center px-10 py-6 rounded-tr-lg rounded-bl-lg">
          <Link
            href="/"
            className="flex w-full justify-start items-center text-xl text-cake-happy-clean"
          >
            Cake Happy
          </Link>
          <div className="flex flex-row justify-end items-center space-x-3 text-cake-happy-dark">
            <Link
              href={'/login'}
              className="bg-cake-happy-clean p-2 rounded-full cursor-pointer"
            >
              <UserRound />
            </Link>
            <CartButton />
          </div>
        </div>
        <TanstackProvider>
          <main className="flex flex-1 w-full px-10 py-4 container mx-auto">
            <CartModal />
            {children}
          </main>
        </TanstackProvider>
        <div className="bg-cake-happy-dark text-cake-happy-clean w-full flex flex-row justify-between bottom-0 items-center rounded-tl-lg rounded-br-lg">
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
              <p>Contato:</p>
              <button className="flex flex-row space-x-2 cursor-pointer">
                <MessageCircleQuestion />
                <p>(64) 99999-8888</p>
              </button>
              <button className="cursor-pointer">
                <a
                  href="https://www.instagram.com/kauan.gkpa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-row space-x-2 "
                >
                  <Instagram />
                  <p>kauan.gkpa</p>
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
