"use client";

import {
  NewPasswordFormInputs,
  ResetPasswordErrorResponse,
  ResetPasswordSuccessResponse,
  resetPassword,
} from "@/api";
import Button from "@/components/Button";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const NewPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormInputs>();
  const [serverError, setServerError] = useState("");

  const params = useParams<{ email: string; token: string }>();

  const router = useRouter();

  const email = params.email.replace("%40", "@");
  const token = params.token;

  const resetMutation = useMutation<
    ResetPasswordSuccessResponse,
    ResetPasswordErrorResponse,
    NewPasswordFormInputs
  >({
    mutationFn: resetPassword,

    onSuccess: () => {
      router.push("/login");
    },

    onError: (error) => {
      setServerError(
        error instanceof Error
          ? "Erreur : " + error.message
          : "Une erreur est survenue."
      );
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (data.password !== data.password_confirm) {
      setServerError("Les mots de passe ne correspondent pas.");
      return;
    }
    resetMutation.mutate({ ...data, email, token });
  });

  return (
    <div className="h-full min-h-dvh">
      <div className="flex h-full min-h-dvh flex-col gap-2 p-3 items-center justify-between max-w-2xl mx-auto">
        <div>
          <h1 className="text-[50px] font-semibold mt-32">Réinitialisation</h1>

          <p className="text-shatibi-grey font-normal">
            Renseignez votre nouveau mot de passe.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-2 w-full font-medium"
        >
          <input
            className="mt-1 block w-full px-3 py-4 bg-white border rounded-xl"
            {...register("password", { required: true })}
            type="password"
            placeholder="Nouveau mot de passe"
          />

          <input
            className="mt-1 block w-full px-3 py-4 bg-white border rounded-xl"
            {...register("password_confirm", { required: true })}
            type="password"
            placeholder="Confirmer le mot de passe"
          />

          <Button type="submit" className="w-10/12 self-center font-bold mt-1">
            Confirmer
          </Button>

          {serverError && (
            <p className="text-shatibi-red italic">{serverError}</p>
          )}
        </form>

        <Image
          className="self-center mb-3 p-6"
          src="/logo-shatibi.png"
          alt="Logo Shatibi"
          width={150}
          height={150}
        />
      </div>
    </div>
  );
};

export default NewPasswordPage;
