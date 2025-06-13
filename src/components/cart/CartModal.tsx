'use client';
import { useCartModalStore } from '@/stores/cart/modal-store';
import { X, CirclePlus, CircleMinus } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../../app/ui/drawer';
import { useProductsCartStore } from '@/stores/cart/cart-product-store';
import { formatCurrency } from '@/lib/utils';

export default function CartModal() {
  const cartStore = useCartModalStore();
  const productsCartStore = useProductsCartStore();

  return (
    <Drawer
      direction="right"
      open={cartStore.isOpen}
      onOpenChange={cartStore.close}
    >
      <DrawerContent className="flex flex-col p-5 min-w-screen md:min-w-2/3 lg:min-w-1/2 xl:min-w-1/3">
        <DrawerHeader className="p-0 pb-3 border-b border-cake-happy-clean">
          <DrawerClose className="bg-cake-happy-clean text-cake-happy-dark rounded-full cursor-pointer w-10 h-10 flex justify-center items-center">
            <X />
          </DrawerClose>
          <DrawerTitle className="flex justify-center items-center text-cake-happy-dark text-lg">
            <p>Meu carrinho</p>
          </DrawerTitle>
        </DrawerHeader>
        <main className="mt-5 overflow-y-auto">
          {productsCartStore.products.length === 0 ? (
            <div className="flex justify-center">
              <p className="text-lg">Carrinho vazio</p>
            </div>
          ) : (
            <div className="bg-gray-100 p-2 rounded-lg">
              <div className="flex flex-row pb-3 border-b border-cake-happy-clean justify-between gap-2">
                <p className="min-w-4/10 max-w-4/10 flex justify-center">
                  Sabor
                </p>
                <p className="min-w-32 max-w-32 flex justify-center">KG</p>
                <p className="w-full flex justify-center">Total</p>
              </div>
              {productsCartStore.products.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-row border-b border-gray-300 items-center gap-2 pb-2 py-2"
                >
                  <p className="min-w-4/10 max-w-4/10 wrap-break-word">
                    {item.name}
                  </p>
                  <div className="min-w-32 max-w-32 flex justify-between px-3 gap-3 p-1 bg-gray-200 rounded-lg text-cake-happy-dark">
                    <CircleMinus
                      className="w-5 cursor-pointer"
                      onClick={() =>
                        productsCartStore.decreaseQuantity(item.id)
                      }
                    />
                    <p className="wrap-break-word select-none">
                      {item.quantity}
                    </p>
                    <CirclePlus
                      className="w-5 cursor-pointer"
                      onClick={() => productsCartStore.addQuantity(item.id)}
                    />
                  </div>
                  <p className="w-full min-w-0 flex justify-center">
                    <span className="break-all">
                      {formatCurrency(productsCartStore.totalValue)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
        <DrawerFooter
          className={`px-0 ${productsCartStore.products.length === 0 && 'hidden'}`}
        >
          <div className="flex flex-row justify-between items-center text-cake-happy-dark text-lg">
            <p>Total:</p>
            <button>{formatCurrency(productsCartStore.totalValue)}</button>
          </div>
          <button
            className={`bg-cake-happy-dark w-full text-white text-lg font-semibold px-3 py-2 rounded-lg flex items-center justify-center`}
          >
            Finalizar compra
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
