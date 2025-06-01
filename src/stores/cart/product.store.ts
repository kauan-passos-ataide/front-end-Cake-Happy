import { create } from 'zustand';

export type Product = {
  quantity: number;
  id: string;
  name: string;
  imageUrl: string;
  price: number;
};

type ProductsCart = {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  addQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
};
export const useProductsCart = create<ProductsCart>((set, get) => ({
  products: [],
  addProduct: (product) => {
    const products = get().products;
    const verifyProduct = products.find((item) => item.id === product.id);
    if (verifyProduct) {
      set((state) => ({
        products: state.products.map((item) =>
          item.id === verifyProduct.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item,
        ),
      }));
    } else {
      set((state) => ({ products: [...state.products, product] }));
    }
  },

  removeProduct: (id) => {
    set((state) => ({
      products: state.products.filter((item) => item.id != id),
    }));
  },

  addQuantity: (id) => {
    set((state) => ({
      products: state.products.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    }));
  },

  decreaseQuantity: (id) => {
    set((state) => ({
      products: state.products.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    }));
  },
}));
