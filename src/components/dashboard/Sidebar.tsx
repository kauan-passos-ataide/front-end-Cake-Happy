'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '../ui/sidebar';
import Link from 'next/link';
import {
  BarcodeIcon,
  CalendarIcon,
  CreditCartIcon,
  HelpIcon,
  HomeIcon,
  LogoutIcon,
  OrderListIcon,
  SettingsIcon,
  StoreIcon,
} from './../icons/icons';
import { useQuery } from '@tanstack/react-query';
import * as dotenv from 'dotenv';
import { useEffect, useState } from 'react';
import { logout } from '@/lib/utils';
import privateApi from '@/services/privateApi';

dotenv.config();
type ItemsType = {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function AppSidebar({ currentPath }: { currentPath: string }) {
  const [itemsMain, setItemsMain] = useState<ItemsType[]>([]);
  const [itemsFooter, setItemsFooter] = useState<ItemsType[]>([]);

  const { isPending, isError, data } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      return await privateApi.get(`/user/verify-role`);
    },
  });
  const defaultPath = '/dashboard';

  useEffect(() => {
    if (!data?.data.role) return;

    if (data.data.role === 'SELLER') {
      setItemsMain([
        { title: 'Home', url: `${defaultPath}`, icon: HomeIcon },
        { title: 'Pedidos', url: `${defaultPath}/orders`, icon: OrderListIcon },
        {
          title: 'Calendario',
          url: `${defaultPath}/calendar`,
          icon: CalendarIcon,
        },
        {
          title: 'Meus produtos',
          url: `${defaultPath}/products`,
          icon: BarcodeIcon,
        },
        {
          title: 'Configurações',
          url: `${defaultPath}/settings`,
          icon: SettingsIcon,
        },
      ]);
      setItemsFooter([
        {
          title: 'Plano',
          url: `${defaultPath}/plan`,
          icon: CreditCartIcon,
        },
        {
          title: 'Suporte',
          url: `${defaultPath}/help`,
          icon: HelpIcon,
        },
      ]);
    } else if (data.data.role === 'USER') {
      setItemsMain([
        { title: 'Home', url: `${defaultPath}`, icon: HomeIcon },
        { title: 'Pedidos', url: `${defaultPath}/orders`, icon: OrderListIcon },
        {
          title: 'Configurações',
          url: `${defaultPath}/settings`,
          icon: SettingsIcon,
        },
      ]);
      setItemsFooter([
        {
          title: 'Suporte',
          url: `${defaultPath}/help`,
          icon: HelpIcon,
        },
      ]);
    }
  }, [data]);

  if (isPending) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarMenu className="mt-20">
            {Array.from({ length: 8 }).map((_, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    );
  }

  if (isError) {
    return;
  }

  return (
    <Sidebar className="text-gray-700">
      <SidebarContent className="text-lg mt-6">
        <SidebarGroup className="border-b">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="rounded-md border border-b-2 border-cake-happy-dark mb-4 hover:bg-gray-100 shadow-md"
                >
                  <Link href={'/'}>
                    <StoreIcon />
                    <span>Loja</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {itemsMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`hover:bg-gray-100 ${
                      currentPath === item.url
                        ? 'border-b-2 border-cake-happy-clean bg-gray-100'
                        : ''
                    }`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-20">
        <SidebarMenu className="text-lg">
          {itemsFooter.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={`rounded-none rounded-l-md hover:bg-gray-100 ${
                  currentPath === item.url
                    ? 'border-b-2 border-cake-happy-clean'
                    : ''
                }`}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton className={`hover:bg-gray-100`} onClick={logout}>
              <LogoutIcon />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
