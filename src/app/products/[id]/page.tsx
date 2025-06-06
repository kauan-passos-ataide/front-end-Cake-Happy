import ProductPageUI from '@/pages/productPage';

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <div className="flex flex-col w-full h-full pb-20">
      <ProductPageUI id={id} />
    </div>
  );
}
