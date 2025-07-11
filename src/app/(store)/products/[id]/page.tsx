import ProductPage from '@/components/product/productPage';

export default async function Product({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <div className="flex flex-col w-full h-full pb-20">
      <ProductPage id={id} />
    </div>
  );
}
