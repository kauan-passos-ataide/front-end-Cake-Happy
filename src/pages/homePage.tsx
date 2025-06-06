'use client';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useProductsStore } from '@/stores/products/product-store';

export default function HomePageUI() {
  const productsStore = useProductsStore();

  return (
    <div className=" w-full h-full flex flex-col items-center justify-center">
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {productsStore.products.map((item) => (
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
                <Link
                  href={`/products/${item.id}`}
                  className="bg-cake-happy-dark w-full text-white rounded-lg px-2 py-1 cursor-pointer flex items-center justify-center"
                >
                  Comprar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
