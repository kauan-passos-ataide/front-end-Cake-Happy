import { create } from 'zustand';

interface token {
  accessToken: string;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<token>((set) => ({
  accessToken: '',
  setAccessToken: (token: string) => {
    set(() => ({ accessToken: token }));
  },
}));
