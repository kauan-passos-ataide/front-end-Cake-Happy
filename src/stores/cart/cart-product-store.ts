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
  totalValue: number;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  addQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
};
export const useProductsCartStore = create<ProductsCart>((set, get) => ({
  products: [],
  totalValue: 0,
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
    set((state) => ({
      totalValue: state.totalValue + product.price * product.quantity,
    }));
  },

  removeProduct: (id) => {
    const products = get().products;
    const product = products.filter((item) => item.id === id);
    set((state) => ({
      totalValue: state.totalValue - product[0].price * product[0].quantity,
    }));
    set((state) => ({
      products: state.products.filter((item) => item.id !== id),
    }));
  },

  addQuantity: (id) => {
    const products = get().products;
    const product = products.filter((item) => item.id === id);
    set((state) => ({
      totalValue: state.totalValue + product[0].price,
    }));
    set((state) => ({
      products: state.products.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    }));
  },

  decreaseQuantity: (id) => {
    const products = get().products;
    const product = products.filter((item) => item.id === id);
    set((state) => ({
      totalValue: state.totalValue - product[0].price,
    }));
    set((state) => ({
      products: state.products.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    }));
  },
}));
