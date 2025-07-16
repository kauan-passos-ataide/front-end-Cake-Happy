'use client';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import '../../globals.css';
import TanstackProvider from '@/lib/tanstack-provider';
import AppSidebar from '@/components/dashboard/Sidebar';
import { usePathname } from 'next/navigation';
import { BreadcrumbWithCustomSeparator } from '@/components/dashboard/Breadcrumb';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <div
      className={`antialiased flex flex-col w-full min-h-screen overflow-x-hidden overflow-y-auto`}
    >
      <div className="w-full h-full flex flex-col flex-1">
        <TanstackProvider>
          <SidebarProvider>
            <AppSidebar currentPath={pathname} />
            <main className="flex flex-col flex-1 w-full">
              <div className="fixed z-30 top-0 px-3 bg-white flex flex-row gap-3 w-full h-10 border-b justify-start items-center">
                <SidebarTrigger className="hover:bg-transparent cursor-pointer" />
                <BreadcrumbWithCustomSeparator currentPath={pathname} />
              </div>
              <div
                className={`flex w-full flex-col flex-1 container mx-auto pt-10 px-3`}
              >
                {children}
              </div>
            </main>
          </SidebarProvider>
        </TanstackProvider>
      </div>
    </div>
  );
}
