'use client';
import { useCartModalStore } from '@/stores/cart/modal.store';
import { ShoppingCart } from 'lucide-react';

export default function CartButton() {
  const cart = useCartModalStore();
  return (
    <button
      className="bg-cake-happy-clean p-2 rounded-full cursor-pointer"
      onClick={cart.open}
    >
      <ShoppingCart />
    </button>
  );
}
