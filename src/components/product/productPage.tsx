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

export default function ProductPage({ id }: { id: string }) {
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
          <h2>Nenhum produto encontrado</h2>
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
                  className="rounded-lg lg:ml-36 min-w-[300px] max-w-[300px] max-h-[300px] min-h-[300px] object-cover drop-shadow-xl/30"
                ></Image>
                <div className="w-full flex flex-col gap-2">
                  <h2 className="font-bold break-words w-full text-cake-happy-dark px-2 py-1 flex justify-center items-center text-start bg-cake-happy-clean/30 border border-cake-happy-dark rounded-tr-lg rounded-bl-lg">
                    {item.name}
                  </h2>
                  <div className="flex flex-col w-full h-44 select-none gap-3 mt-2 bg-gray/30 text-cake-happy-dark px-3 py-5 rounded-tl-lg rounded-br-lg shadow-black/30 shadow-lg">
                    <div className="flex flex-row justify-between items-center">
                      <div>
                        <h2>Valor por kg: {formatCurrency(item.price)}</h2>
                      </div>
                      <div className="w-40 flex flex-row justify-between mx-1 gap-3 py-1 px-4 bg-cake-happy-dark rounded-lg text-white">
                        <CircleMinus
                          className="w-5 cursor-pointer"
                          onClick={decreaseQuantity}
                        />
                        <h2 className="wrap-break-word select-none">
                          {quantity}
                        </h2>
                        <CirclePlus
                          className="w-5 cursor-pointer"
                          onClick={addQuantity}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <h2>Total:</h2>
                      <button>{formatCurrency(item.price * quantity)}</button>
                    </div>
                    <button
                      className="bg-cake-happy-dark w-auto mt-auto text-white rounded-lg px-4 py-2 cursor-pointer hover:shadow-cake-happy-dark/30 hover:shadow-lg transition-all ease-in-out"
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
                <h2 className="flex bg-cake-happy-dark w-full px-2 py-1 text-white rounded-tr-lg rounded-bl-lg justify-center items-center">
                  Descrição
                </h2>
                <p className="text-justify">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
