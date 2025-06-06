import { ProductType } from '@/types/product-type';
import axios from 'axios';
import { create } from 'zustand';
import * as dotenv from 'dotenv';

dotenv.config();

type GetProductsByCategory = {
  category: string;
};

type GetProductsById = {
  id: string;
};

type ProductStore = {
  products: ProductType[];
  filterProducts: ProductType[];
  getProductsByCategory: (category: GetProductsByCategory) => void;
  getProductsById: (id: GetProductsById) => void;
  addProducts: (data: ProductType[]) => void;
};

export const useProductsStore = create<ProductStore>((set, get) => ({
  products: [
    {
      id: '123',
      name: 'Bolo de chocolate',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      imageUrl: '/cake-1.jpg',
      price: 50.0,
      category: 'cake',
    },
    {
      id: '456',
      name: 'Bolo de coco',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      imageUrl: '/cake-2.webp',
      price: 50.0,
      category: 'cake',
    },
    {
      id: '789',
      name: 'Bolo de morango',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      imageUrl: '/cake-3.webp',
      price: 50.0,
      category: 'cake',
    },
    {
      id: '965',
      name: 'Bolo de pessego',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      imageUrl: '/cake-4.webp',
      price: 50.0,
      category: 'cake',
    },
    {
      id: '887',
      name: 'Bolo 4 leites',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      imageUrl: '/cake-5.jpg',
      price: 50.0,
      category: 'cake',
    },
    {
      id: '227',
      name: 'Bolo de prestigio',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      imageUrl: '/cake-6.jpg',
      price: 50.0,
      category: 'cake',
    },
  ],
  filterProducts: [],
  addProducts: (data: ProductType[]) => {
    set((state) => ({
      products: (state.products = data),
    }));
  },
  getProductsByCategory: async ({ category }: GetProductsByCategory) => {
    const products = get().products;
    if (
      products.length === 0 ||
      products.filter((item) => item.category === category).length === 0
    ) {
      const getProductsFroDb: ProductType[] = await axios.get(
        `${process.env.URL_API as string}/products`,
        {
          params: { category },
        },
      );
      set(() => ({
        filterProducts: getProductsFroDb,
      }));
    } else {
      set((state) => ({
        filterProducts: state.products.filter(
          (item) => item.category === category,
        ),
      }));
    }
  },
  getProductsById: async ({ id }: GetProductsById) => {
    const products = get().products;
    if (
      products.length === 0 ||
      products.filter((item) => item.id === id).length === 0
    ) {
      const getProductsFroDb: ProductType[] = await axios.get(
        `${process.env.URL_API as string}/products`,
        {
          params: { id },
        },
      );
      set(() => ({
        filterProducts: getProductsFroDb,
      }));
    } else {
      set((state) => ({
        filterProducts: state.products.filter((item) => item.id === id),
      }));
    }
  },
}));
