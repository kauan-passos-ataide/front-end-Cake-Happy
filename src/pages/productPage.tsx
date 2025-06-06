'use client';
import { useCartModalStore } from '@/stores/cart/modal-store';
import {
  Product,
  useProductsCartStore,
} from '@/stores/cart/cart-product-store';
import { useProductsStore } from '@/stores/products/product-store';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CircleMinus, CirclePlus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ProductPageUI({ id }: { id: string }) {
  const cartStore = useCartModalStore();
  const productsCartStore = useProductsCartStore();
  const productsStore = useProductsStore();
  const [quantity, setQuantity] = useState<number>(1);

  const addQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    if (productsStore.filterProducts.length === 0) {
      productsStore.getProductsById({ id });
    } else if (productsStore.filterProducts[0].id !== id) {
      productsStore.getProductsById({ id });
    }
  }, [id, productsStore]);

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
    <div className="w-full h-full">
      {productsStore.filterProducts.length === 0 ? (
        <div className="flex flex-col w-full h-full items-center justify-center gap-5">
          <h1>Nenhum produto encontrado</h1>
          <Link
            href={'/'}
            className="px-2 py-1 bg-cake-happy-dark text-white rounded-lg"
          >
            Voltar para tela inicial
          </Link>
        </div>
      ) : (
        <div>
          {productsStore.filterProducts.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-5">
              <div className="flex flex-col md:flex-row gap-5 items-center md:items-start w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="rounded-lg min-w-[300px] max-w-[300px] max-h-[300px] min-h-[300px] object-cover"
                ></Image>
                <div className="w-full flex flex-col gap-2">
                  <h1 className="flex font-bold w-full text-cake-happy-dark px-2 py-1 bg-cake-happy-clean/30 border border-cake-happy-dark rounded-lg justify-center items-center">
                    {item.name}
                  </h1>
                  <div className="flex flex-col w-full h-44 select-none gap-3 bg-cake-happy-clean/30 text-cake-happy-dark px-3 py-5 rounded-lg ">
                    <div className="flex flex-row justify-between items-center">
                      <div>
                        <h1>Valor por kg: {formatCurrency(item.price)}</h1>
                      </div>
                      <div className="w-3/10 flex justify-center mx-1 gap-3 p-1 bg-cake-happy-dark rounded-lg text-cake-happy-clean">
                        <CircleMinus
                          className="w-5 cursor-pointer"
                          onClick={decreaseQuantity}
                        />
                        <h1 className="wrap-break-word select-none">
                          {quantity}
                        </h1>
                        <CirclePlus
                          className="w-5 cursor-pointer"
                          onClick={addQuantity}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <h1>Total:</h1>
                      <button>{formatCurrency(item.price * quantity)}</button>
                    </div>
                    <button
                      className="bg-cake-happy-dark w-auto mt-auto text-white rounded-lg px-4 py-2 cursor-pointer"
                      onClick={() =>
                        addItemToCart({
                          id: item.id,
                          name: item.name,
                          imageUrl: item.imageUrl,
                          price: item.price,
                          quantity: quantity,
                        })
                      }
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5 mt-10">
                <h2 className="flex bg-cake-happy-dark w-full px-2 py-1 text-white rounded-lg justify-center items-center">
                  Descrição
                </h2>
                <h2>{item.description}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
