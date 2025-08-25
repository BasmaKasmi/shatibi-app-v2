"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/Button";
import Image from "next/image";
import { RecoveryResponse, sendRecoveryEmail } from "@/api";

type RecoveryFormInputs = {
  email: string;
};

const RecoveryPage = () => {
  const { register, handleSubmit } = useForm<RecoveryFormInputs>();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const recoveryMutation = useMutation<RecoveryResponse, Error, string>({
    mutationFn: sendRecoveryEmail,
    onSuccess: (data) => {
      setMessage("Un e-mail vous a été envoyé.");
      setIsSuccess(true);
    },
    onError: (error) => {
      setMessage("Erreur lors de la demande de réinitialisation.");
      setIsSuccess(false);
      console.error(error);
    },
  });

  const onSubmit = handleSubmit((data) => {
    recoveryMutation.mutate(data.email);
  });

  return (
    <div className="h-full min-h-dvh">
      <div className="flex h-full min-h-dvh flex-col gap-2 p-3 items-center justify-between max-w-2xl mx-auto">
        <div>
          <h1 className="text-[54px] font-semibold mt-32">
            Mot de passe oublié ?
          </h1>

          <p className="text-shatibi-grey font-normal">
            Renseignez votre adresse mail pour redéfinir votre mot de passe.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-2 w-full font-medium"
        >
          <input
            className="mt-1 block w-full px-3 py-4 bg-white border rounded-xl"
            {...register("email")}
            type="email"
            placeholder="Entrez votre email"
          />
          <Button className="w-10/12 self-center font-bold mt-1" type="submit">
            Envoyer
          </Button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center text-lg font-semibold ${
              isSuccess ? "text-shatibi-green" : "text-shatibi-red"
            }`}
          >
            {message}
          </p>
        )}
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

export default RecoveryPage;
