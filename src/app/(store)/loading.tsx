import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex w-full h-full bg-white justify-center items-center">
      <LoaderCircle className="animate-spin text-cake-happy-dark w-20 h-20" />
    </div>
  );
}
