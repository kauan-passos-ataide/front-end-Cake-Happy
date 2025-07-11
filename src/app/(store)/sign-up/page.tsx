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
import axios, { AxiosError } from 'axios';
import * as dotenv from 'dotenv';
import { useMutation } from '@tanstack/react-query';
import { InputOTPForm } from '@/components/otp-auth/InputOtpForm';

dotenv.config();

const FormSchema = z
  .object({
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-=[\]{};':"\\|,.<>/?]).+$/,
      ),
    confirmPassword: z.string(),
    email: z.email(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas precisam ser iguais!',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof FormSchema>;

export default function SignUp() {
  const [show, setShow] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [showOtpSetup, setShowOtpSetup] = useState<boolean>(false);
  const [srcQrCode, setSrcQrCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
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
    mutationFn: async (info: FormData) => {
      setUser((item) => ({
        ...item,
        email: info.email,
        password: info.password,
      }));
      return await axios.post(`${url}/user/sign-up`, {
        email: info.email,
        password: info.password,
        first_name: 'Kauan',
        last_name: 'Ataide',
        cpf: '123.456.789-11',
        city: 'Mineiros',
        complement: 'q.x l.n',
        country: 'Brasil',
        neighborhood: 'Jardim floresta',
        number_address: 's/n',
        state: 'Goiás',
        street: 'Av. tttt',
        zip_code: '75800-000',
        phone: '(64) 99932-9988',
      });
    },
    onMutate: () => {
      setDisableButton(true);
    },
    onSuccess: (data) => {
      console.log(data.data);
      setSrcQrCode(data.data?.srcQrCode);
      setShowOtpSetup(true);
    },
    onError: (error: AxiosError) => {
      if (error.status === 500) {
        setErrorMessage(
          'Erro interno no servidor, tente novamente mais tarde!',
        );
      }
      if (error.status === 401) {
        setErrorMessage(
          'Já existe uma conta com esse e-mail, faça login ou crie uma nova conta!',
        );
      }
      setDisableButton(false);
    },
  });
  async function onSubmit(data: FormData) {
    mutation.mutateAsync(data);
  }

  if (!showOtpSetup) {
    return (
      <div className="border-cake-happy-dark px-10 py-10 rounded-lg my-auto mx-auto w-[400px] md:w-[500px] shadow-black/30 shadow-lg">
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
          <p className="text-sm text-red-500">{errorMessage}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <span>E-mail:</span>
            <input
              type="email"
              {...register('email')}
              placeholder="Digite o seu e-mail"
              className="px-2 py-1 mb-3 ring ring-cake-happy-dark rounded-lg placeholder-cake-happy-dark/70 text-cake-happy-dark focus:ring-cake-happy-clean focus:ring-2 focus:outline-none focus:border-0 transition-all ease-in-out"
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
              className="text-cake-happy-dark mb-3 cursor-pointer flex flex-row gap-2 items-center"
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
            <span>Confirme sua senha:</span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="Confirme a sua senha"
              className="px-2 py-1 ring ring-cake-happy-dark rounded-lg placeholder-cake-happy-dark/70 text-cake-happy-dark focus:ring-cake-happy-clean focus:ring-2 focus:outline-none focus:border-0 transition-all ease-in-out"
            />
            {errors.confirmPassword?.message ===
              'As senhas precisam ser iguais!' && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-cake-happy-dark cursor-pointer flex flex-row gap-2 items-center"
            >
              {showConfirmPassword ? (
                <EyeClosed className="text-sm" />
              ) : (
                <Eye className="text-sm" />
              )}
              {showConfirmPassword ? (
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
                !!errors.confirmPassword ||
                isSubmitting ||
                disableButton
              }
              className={`flex mt-4 w-full bg-cake-happy-dark text-white p-2 rounded ${
                (!!errors.email ||
                  !!errors.password ||
                  !!errors.root ||
                  !!errors.confirmPassword) &&
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
            href={'/login'}
            className="text-cake-happy-dark flex flex-row gap-1"
          >
            <p>Já possui conta?</p>
            <p className="underline underline-offset-3 hover:text-cake-happy-clean transition-all ease-in-out">
              Faça login aqui!
            </p>
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-center items-center py-10 rounded-lg my-auto mx-auto">
        <div className="flex flex-col justify-center mb-10 gap-5 items-center border-cake-happy-dark px-5 py-5 rounded-lg my-auto mx-auto w-[400px] md:w-[500px] shadow-black/30 shadow-lg">
          <ul className="list-disc list-inside text-justify">
            <p className="pb-2">
              Faça sua autentificação seguindo os seguintes passos:
            </p>
            <li>
              Abra o seu aplicativo autenticador (Google Authenticator,
              Microsoft Authenticator...)
            </li>
            <li>Leia o QR Code abaixo</li>
            <li>Digite o código OTP gerado no campo abaixo do QR Code</li>
          </ul>
          <Image
            src={srcQrCode}
            alt="Leia o qr code"
            width={300}
            height={300}
            quality={80}
          ></Image>
        </div>
        <InputOTPForm user={user} />
      </div>
    );
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
