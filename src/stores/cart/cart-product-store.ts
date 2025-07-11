import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Product = {
  quantity: number;
  id: string;
  name: string;
  imageUrl: string;
  price: number;
};

type ProductsCart = {
  products: Product[];
  totalValue: number;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  addQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
};
export const useProductsCartStore = create<ProductsCart>()(
  persist(
    (set, get) => ({
      products: [],
      totalValue: 0,
      addProduct: (product) => {
        const products = get().products;
        const verifyProduct = products.find((item) => item.id === product.id);
        let updateProducts;

        if (verifyProduct) {
          updateProducts = products.map((item) =>
            item.id === verifyProduct.id
              ? { ...item, quantity: item.quantity + product.quantity }
              : item,
          );
        } else {
          updateProducts = [...products, product];
        }
        set((state) => ({
          products: updateProducts,
          totalValue: state.totalValue + product.price * product.quantity,
        }));
      },

      removeProduct: (id) => {
        const products = get().products;
        const product = products.find((item) => item.id === id);

        if (product) {
          set((state) => ({
            totalValue: state.totalValue - product.price * product.quantity,
            products: state.products.filter((item) => item.id !== id),
          }));
        }
      },

      addQuantity: (id) => {
        const products = get().products;
        const verifyProduct = products.find((item) => item.id === id);
        set((state) => ({
          products: state.products.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }));
        if (verifyProduct) {
          set((state) => ({
            totalValue: state.totalValue + verifyProduct.price,
          }));
        }
      },

      decreaseQuantity: (id) => {
        const products = get().products;
        const verifyProduct = products.find((item) => item.id === id);
        set((state) => ({
          products: state.products.map((item) =>
            item.id === id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          ),
        }));
        if (verifyProduct && verifyProduct.quantity > 1) {
          set((state) => ({
            totalValue: state.totalValue - verifyProduct.price,
          }));
        }
      },
      clearCart: () => set({ products: [], totalValue: 0 }),
    }),
    {
      name: 'cart-storage',
    },
  ),
);
