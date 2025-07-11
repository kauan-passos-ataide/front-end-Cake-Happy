import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center text-cake-happy-dark gap-6">
      <div className="flex flex-row justify-center items-center">
        <h1 className="pr-3 border-r border-cake-happy-dark text-3xl">404</h1>
        <h1 className="pl-3 text-xl">Página não encontrada!</h1>
      </div>
      <div>
        <Link
          href={'/'}
          className="px-2 py-1 text-white bg-cake-happy-dark flex justify-center items-center rounded-lg"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
