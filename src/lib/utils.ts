import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const logout = async () => {
  await axios.post(
    `${process.env.NEXT_PUBLIC_URL_API as string}/user/logout`,
    null,
    {
      withCredentials: true,
    },
  );
};
