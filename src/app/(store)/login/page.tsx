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
import { useMutation } from '@tanstack/react-query';
import { InputOTPForm } from '@/components/otp-auth/InputOtpForm';

dotenv.config();

//implementar função para caso tenha dado algum erro na hora de criar o sistema, para a pessoa ao fazzer
//login, ela poder acessar a parte de configurar o sistema, mas apenas na primeira vez... ou então
//eu posso fazer antes do dashboard ter uma parte de ler o qr code, mas tenho que fazer de uma forma
//que um hacker não possa por exemplo fingir que nunca leu, ou seja, o backend só pode retornar algo,
//se não tiver sido authenticado nenhuma vez (a secret já vai ter sido gerada, então precisa de mais um campo)

const FormSchema = z.object({
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-=[\]{};':"\\|,.<>/?]).+$/,
    ),
  email: z.email(),
});

type FormData = z.infer<typeof FormSchema>;

export default function Login() {
  const [show, setShow] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [otp, setOtp] = useState<boolean>(false);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');

  const hasMinLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const url = process.env.NEXT_PUBLIC_URL_API as string;

  const mutation = useMutation({
    mutationFn: async (data: FormData) =>
      await axios.post(`${url}/user/login`, {
        email: data.email,
        password: data.password,
      }),
    onMutate: () => {
      setDisableButton(true);
    },
    onSuccess: () => {
      setOtp(true);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErrorMessage('E-mail ou senha incorretos!');
        }
        if (error.response?.status === 500) {
          setErrorMessage(
            'Erro interno no servidor, tente novamente mais tarde!',
          );
        }
      }
      setDisableButton(false);
    },
  });

  async function onSubmit(data: FormData) {
    setUser((prev) => ({
      ...prev,
      email: data.email,
      password: data.password,
    }));
    mutation.mutateAsync(data);
  }

  if (!otp) {
    return (
      <div
        className={`border-cake-happy-dark px-10 py-14 rounded-lg my-auto mx-auto w-[400px] md:w-[500px] shadow-black/30 shadow-lg`}
      >
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
            <span>Senha:</span>
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
  } else {
    return <InputOTPForm user={user} />;
  }
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
