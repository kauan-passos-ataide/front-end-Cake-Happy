'use client';
import Image from 'next/image';
import {
  EyeClosed,
  Eye,
  CircleX,
  CircleCheck,
  LoaderCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod/v4';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth/auth-store';

dotenv.config();

const passwordSchema = z.object({
  password: z
    .string()
    .min(8)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/\d/)
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/),
  email: z.email(),
});

type FormData = z.infer<typeof passwordSchema>;

export default function SignIn() {
  const [show, setShow] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const router = useRouter();
  const authStore = useAuthStore();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');

  const hasMinLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const url = 'http://localhost:5000/api';

  const mutation = useMutation({
    mutationFn: async (info: FormData) =>
      await axios.post(
        `${url}/user/login`,
        {
          email: info.email,
          password: info.password,
        },
        {
          withCredentials: true,
        },
      ),
    onMutate: () => {
      setDisableButton(true);
    },
    onSuccess: (data) => {
      authStore.setAccessToken(data.data);
      router.push('/dashboard');
    },
    onError: () => {
      setErrorMessage('E-mail ou senha incorretos!');
      setDisableButton(false);
    },
  });
  async function onSubmit(data: FormData) {
    mutation.mutateAsync(data);
  }

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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {errorMessage !== '' && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
          <span>E-mail:</span>
          <input
            type="email"
            {...register('email')}
            placeholder="Digite o seu e-mail"
            className="px-2 py-1 mb-5 ring ring-cake-happy-dark rounded-lg placeholder-cake-happy-dark/70 text-cake-happy-dark focus:ring-cake-happy-clean focus:ring-2 focus:outline-none focus:border-0 transition-all ease-in-out"
          />
          <span>Password:</span>
          <input
            type={show ? 'text' : 'password'}
            {...register('password')}
            placeholder="Digite a sua senha"
            className="px-2 py-1 ring ring-cake-happy-dark rounded-lg placeholder-cake-happy-dark/70 text-cake-happy-dark focus:ring-cake-happy-clean focus:ring-2 focus:outline-none focus:border-0 transition-all ease-in-out"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="text-cake-happy-dark cursor-pointer flex flex-row gap-2 items-center"
          >
            {show ? (
              <EyeClosed className="text-sm" />
            ) : (
              <Eye className="text-sm" />
            )}
            {show ? (
              <p className="text-md">Esconder senha</p>
            ) : (
              <p className="text-md">Mostrar senha</p>
            )}
          </button>
          {}
          <ul className="mt-3 text-sm space-y-1">
            <PasswordRule valid={hasMinLength}>
              Mínimo de 8 caracteres
            </PasswordRule>
            <PasswordRule valid={hasLower}>
              Pelo menos 1 letra minúscula
            </PasswordRule>
            <PasswordRule valid={hasUpper}>
              Pelo menos 1 letra maiúscula
            </PasswordRule>
            <PasswordRule valid={hasNumber}>Pelo menos 1 número</PasswordRule>
            <PasswordRule valid={hasSymbol}>
              Pelo menos 1 símbolo especial
            </PasswordRule>
          </ul>
          <button
            type="submit"
            disabled={
              !!errors.email ||
              !!errors.password ||
              !!errors.root ||
              isSubmitting ||
              disableButton
            }
            className={`flex mt-4 w-full bg-cake-happy-dark text-white p-2 rounded ${
              (!!errors.email || !!errors.password || !!errors.root) &&
              'bg-gray-400'
            } cursor-pointer transition-all ease-in-out items-center justify-center`}
          >
            {isSubmitting || disableButton ? (
              <LoaderCircle className="animate-spin text-white" />
            ) : (
              'Entrar'
            )}
          </button>
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

function PasswordRule({
  valid,
  children,
}: {
  valid: boolean;
  children: React.ReactNode;
}) {
  return (
    <li
      className={`flex items-center gap-2 ${valid ? 'text-green-600' : 'text-red-500'}`}
    >
      <span>{valid ? <CircleCheck /> : <CircleX />}</span>
      {children}
    </li>
  );
}
