"use client";

import Button from "@/components/Button";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  changePassword,
  ChangePasswordResponse,
  ChangePasswordPayload,
} from "@/lib/student-api";
import Image from "next/image";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useDeviceDetect from "@/hooks/useDeviceDetect";

const INPUT_CLASSNAMES =
  "rounded-xl border-gray-400 border p-4 w-full w-11/12 self-center";

type Inputs = {
  password: string;
  password_confirm: string;
};

const RecoverStudentPage = () => {
  const search = useSearchParams();
  const studentId = Number(search.get("studentId"));
  const token = search.get("token");
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [showNonMobileMessage, setShowNonMobileMessage] = useState(false);
  const { register, handleSubmit } = useForm<Inputs>();
  const { isMobile, isLoading } = useDeviceDetect();

  const mutation = useMutation<
    ChangePasswordResponse,
    Error,
    ChangePasswordPayload
  >({
    mutationFn: (data: ChangePasswordPayload) => changePassword(data),
    onSuccess: (data: ChangePasswordResponse) => {
      if (data.status === "success") {
        console.log("Mot de passe changé avec succès");

        if (isMobile) {
          router.push("/student-login");
        } else {
          setShowNonMobileMessage(true);
        }
      } else {
        setErrorMessage("Erreur lors du changement de mot de passe.");
      }
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Erreur inconnue.");
    },
  });

  const onSubmit = (data: Inputs) => {
    if (!studentId || !token) {
      setErrorMessage("Identifiant ou token manquant.");
      return;
    }

    mutation.mutate({
      student_id: studentId,
      token: token as string,
      password: data.password,
      password_confirm: data.password_confirm,
    });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="h-full min-h-dvh">
      <div className="flex h-full min-h-dvh flex-col gap-2 p-3 items-center justify-between max-w-2xl mx-auto">
        <div>
          <h1 className="text-[40px] font-semibold mt-32">
            Mot de passe à redéfinir ?
          </h1>
          <p className="text-shatibi-grey font-normal">
            Renseignez votre nouveau mot de passe.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full font-medium"
        >
          <input
            className={clsx(INPUT_CLASSNAMES, {
              "border border-red-600 placeholder:text-red-600": errorMessage,
            })}
            type="password"
            autoComplete="new-password"
            placeholder="Nouveau mot de passe"
            {...register("password")}
          />
          <input
            className={clsx(INPUT_CLASSNAMES, {
              "border border-red-600 placeholder:text-red-600": errorMessage,
            })}
            type="password"
            autoComplete="new-password"
            placeholder="Confirmer le mot de passe"
            {...register("password_confirm")}
          />

          {errorMessage !== "" ? (
            <p className="text-red-600 font-semibold">{errorMessage}</p>
          ) : null}

          <Button type="submit" className="w-10/12 self-center font-bold mt-1">
            Confirmer
          </Button>
        </form>

        {showNonMobileMessage && (
          <div className="mt-4 text-center">
            <p className="text-red-600 font-semibold">
              Votre mot de passe a été changé. Merci de vous connecter sur le
              téléphone avec votre nouveau mot de passe
            </p>
          </div>
        )}

        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Image
              className="self-center p-6"
              src="/logo-shatibi.png"
              alt="Logo Shatibi"
              width={150}
              height={150}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoverStudentPage;
