'use client';
import { useCartModalStore } from '@/stores/cart/modal.store';
import { X, CirclePlus, CircleMinus } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';
import { useProductsCart } from '@/stores/cart/product.store';
import { formatCurrency } from '@/lib/utils';

export default function CartModal() {
  const cartStore = useCartModalStore();
  const productsCartStore = useProductsCart();

  return (
    <Drawer
      direction="right"
      open={cartStore.isOpen}
      onOpenChange={cartStore.close}
    >
      <DrawerContent className="flex flex-col p-5">
        <DrawerHeader className="p-0 pb-3 border-b border-cake-happy-clean">
          <DrawerClose className="bg-cake-happy-clean text-cake-happy-dark rounded-full cursor-pointer w-10 h-10 flex justify-center items-center">
            <X />
          </DrawerClose>
          <DrawerTitle className="flex justify-center items-center text-cake-happy-dark text-lg">
            Meu carrinho
          </DrawerTitle>
        </DrawerHeader>
        <main className="mt-5">
          {productsCartStore.products.length === 0 ? (
            <div className="flex justify-center">
              <h1 className="text-lg">Carrinho vazio</h1>
            </div>
          ) : (
            <div className="bg-gray-100 p-2 rounded-lg">
              <div className="flex flex-row pb-3 border-b border-cake-happy-clean justify-start gap-2">
                <h1 className="w-4/10 flex justify-start">Sabor</h1>
                <h1 className="w-3/10 flex justify-center">KG</h1>
                <h1 className="w-3/10 flex justify-start">Total</h1>
              </div>
              {productsCartStore.products.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-row border-b border-gray-300 items-center pb-2 py-2"
                >
                  <h1 className="w-4/10 wrap-break-word">{item.name}</h1>
                  <div className="w-3/10 flex justify-center mx-1 gap-3 p-1 bg-gray-200 rounded-lg text-cake-happy-dark">
                    <CircleMinus
                      className="w-5 cursor-pointer"
                      onClick={() =>
                        productsCartStore.decreaseQuantity(item.id)
                      }
                    />
                    <h1 className="wrap-break-word select-none">
                      {item.quantity}
                    </h1>
                    <CirclePlus
                      className="w-5 cursor-pointer"
                      onClick={() => productsCartStore.addQuantity(item.id)}
                    />
                  </div>
                  <h1 className="w-3/10 wrap-break-word pl-1">
                    {formatCurrency(item.quantity * item.price)}
                  </h1>
                </div>
              ))}
            </div>
          )}
        </main>
        <DrawerFooter className="px-0">
          <button
            className={`bg-cake-happy-dark w-full text-white text-lg font-semibold px-3 py-2 rounded-lg flex items-center justify-center ${productsCartStore.products.length === 0 && 'hidden'}`}
          >
            Finalizar compra
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
