'use client';
import { useCartModalStore } from '@/stores/cart/modal-store';
import { X, CirclePlus, CircleMinus, LoaderCircle } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';
import { useProductsCartStore } from '@/stores/cart/cart-product-store';
import { formatCurrency } from '@/lib/utils';
import { loadStripe } from '@stripe/stripe-js';
import * as dotenv from 'dotenv';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';

dotenv.config();

export default function CartModal() {
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const cartStore = useCartModalStore();
  const productsCartStore = useProductsCartStore();
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
  );
  const mutation = useMutation({
    mutationFn: async () =>
      await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API as string}/stripe/checkout`,
        productsCartStore.products.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      ),
    onMutate: () => {
      setDisableButton(true);
    },
    onSuccess: (data) => {
      setDisableButton(false);
      checkout(data.data.id);
    },
    onError: (err: AxiosError) => {
      setDisableButton(false);
      if (err.isAxiosError) {
        alert(err.message);
      }
    },
  });
  async function checkout(id: string) {
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({
      sessionId: id,
    });
  }
  const handleSubmit = () => {
    mutation.mutateAsync();
  };

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
                      {formatCurrency(item.price * item.quantity)}
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
            <p>{formatCurrency(productsCartStore.totalValue)}</p>
          </div>
          <button
            className={`bg-cake-happy-dark w-full text-white text-lg font-semibold px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer`}
            onClick={handleSubmit}
          >
            {disableButton ? (
              <LoaderCircle className="animate-spin text-white" />
            ) : (
              'Finalizar compra'
            )}
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
