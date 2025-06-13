'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <div className="border-cake-happy-dark px-10 py-14 rounded-lg my-auto mx-auto w-[400px] md:w-[500px] shadow-black/30 shadow-lg">
      <div className="flex flex-row border mb-5 border-cake-happy-dark text-cake-happy-dark px-5 py-1 rounded-lg gap-3 cursor-pointer justify-center items-center">
        <Image
          src={'https://developers.google.com/identity/images/g-logo.png'}
          alt="logo google"
          width={24}
          height={24}
          quality={100}
        />
        <button className="cursor-pointer">Login com Google</button>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <span>E-mail:</span>
          <input
            type="email"
            name="email"
            placeholder="Digite o seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-2 py-1 mb-5 ring ring-cake-happy-dark rounded-lg placeholder-cake-happy-dark/70 text-cake-happy-dark focus:ring-cake-happy-clean focus:ring-2 focus:outline-none focus:border-0 transition-all ease-in-out"
          />
          <span>Password:</span>
          <input
            type="password"
            name="password"
            placeholder="Digite a sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-2 py-1 ring ring-cake-happy-dark rounded-lg placeholder-cake-happy-dark/70 text-cake-happy-dark focus:ring-cake-happy-clean focus:ring-2 focus:outline-none focus:border-0 transition-all ease-in-out"
          />
        </form>
      </div>
      <div className="mt-2">
        <Link
          href={'/sign-up'}
          className="text-cake-happy-dark flex flex-row gap-1"
        >
          <p>Não possui conta?</p>
          <p className="underline underline-offset-3 hover:text-cake-happy-clean transition-all ease-in-out">
            Crie sua conta aqui!
          </p>
        </Link>
      </div>
    </div>
  );
}
