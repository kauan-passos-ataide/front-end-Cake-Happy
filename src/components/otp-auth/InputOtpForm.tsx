'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  code: z.string().min(6, {
    message: 'Seu código precisa ter 6 digítos.',
  }),
});

type FormType = z.infer<typeof FormSchema>;

type User = {
  email: string;
  password: string;
};

export function InputOTPForm({ user }: { user: User }) {
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  });
  const url = process.env.NEXT_PUBLIC_URL_API as string;

  const mutation = useMutation({
    mutationFn: async (info: FormType) =>
      await axios.post(
        `${url}/user/2fa-auth`,
        {
          code: info.code,
          email: user.email,
          password: user.password,
        },
        {
          withCredentials: true,
        },
      ),
    onMutate: () => {
      setDisableButton(true);
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErrorMessage('Código inválido!');
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
  async function onSubmit(data: FormType) {
    mutation.mutateAsync(data);
  }

  return (
    <div className="w-full h-full lg:w-[600px] flex flex-col justify-center items-start lg:items-center mx-auto gap-3">
      <div className="w-full flex flex-row justify-start items-start">
        <p className="text-lg text-cake-happy-dark text-start">
          Digite o código do seu autenticador abaixo:
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full gap-2 flex flex-col justify-center items-center"
      >
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <InputOTP maxLength={6} {...field}>
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        <p className="text-red-500 text-start">{errorMessage}</p>

        <button
          type="submit"
          className={`flex mt-7 w-full bg-cake-happy-dark text-white p-2 rounded ${
            (!!errors.code || !!errors.root) && 'bg-gray-400'
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
  );
}
