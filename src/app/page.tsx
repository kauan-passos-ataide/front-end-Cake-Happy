'use client';
import { useState } from 'react';
import { Cakes } from '../schemas/CakesSchema';
import Image from 'next/image';
import { useCartModalStore } from '@/stores/cart/modal.store';
import { Product, useProductsCart } from '@/stores/cart/product.store';
import { formatCurrency } from '@/lib/utils';

export default function Home() {
  const [cakes, setCakes] = useState<Cakes[]>([
    {
      id: '123',
      name: 'Bolo de chocolate',
      description: 'Bolo Qualquer',
      imageUrl: '/cake-1.jpg',
      price: 50.0,
    },
    {
      id: '456',
      name: 'Bolo de coco',
      description: 'Bolo Qualquer',
      imageUrl: '/cake-2.webp',
      price: 50.0,
    },
    {
      id: '789',
      name: 'Bolo de morango',
      description: 'Bolo Qualquer',
      imageUrl: '/cake-3.webp',
      price: 50.0,
    },
    {
      id: '965',
      name: 'Bolo de pessego',
      description: 'Bolo Qualquer',
      imageUrl: '/cake-4.webp',
      price: 50.0,
    },
    {
      id: '887',
      name: 'Bolo 4 leites',
      description: 'Bolo Qualquer',
      imageUrl: '/cake-5.jpg',
      price: 50.0,
    },
    {
      id: '227',
      name: 'Bolo de prestigio',
      description: 'Bolo Qualquer',
      imageUrl: '/cake-6.jpg',
      price: 50.0,
    },
  ]);

  const cartStore = useCartModalStore();
  const productsCartStore = useProductsCart();

  const addItemToCart = (item: Product) => {
    productsCartStore.addProduct({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: item.quantity,
    });
    cartStore.open();
  };

  return (
    <div className=" w-full h-full flex flex-col items-center justify-center">
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {cakes.map((item) => (
          <div
            key={item.id}
            className="bg-cake-happy-clean/20 rounded-lg px-3 py-5 flex flex-col items-center justify-center gap-2 max-w-[250px]"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={150}
              height={150}
              className="rounded-lg min-w-[150px] min-h-[150px] object-cover"
            ></Image>
            <div className="w-full h-full flex flex-col justify-between">
              <h1 className="text-lg wrap-break-word">{item.name}</h1>
              <div className="w-full">
                <h2 className="mt-3 font-bold">{formatCurrency(item.price)}</h2>
                <button
                  className="bg-cake-happy-dark w-full text-white rounded-lg px-2 py-1 cursor-pointer"
                  onClick={() =>
                    addItemToCart({
                      id: item.id,
                      name: item.name,
                      imageUrl: item.imageUrl,
                      price: item.price,
                      quantity: 1,
                    })
                  }
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
