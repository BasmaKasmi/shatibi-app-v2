"use client";

import Button from "@/components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import student from "@/public/assets/student.svg";
import clsx from "clsx";
import Cookie from "js-cookie";
import { useForm } from "react-hook-form";
import {
  loginStudent,
  LoginStudentResponse,
  LoginStudentCredentials,
} from "@/lib/student-api";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/backend-api";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Modal } from "@mantine/core";
import AccessDeniedModal from "@/components/AccessDeniedModal";

const INPUT_CLASSNAMES =
  "rounded-xl border-gray-400 border p-4 w-full w-11/12 self-center";

const StudentLoginPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const { register, watch, handleSubmit } = useForm<LoginStudentCredentials>();

  const [opened, setOpened] = useState(false);

  const openModal = () => setOpened(true);
  const closeModal = () => setOpened(false);

  const mutation = useMutation<
    LoginStudentResponse,
    Error,
    LoginStudentCredentials
  >({
    mutationFn: (data: LoginStudentCredentials) => loginStudent(data),
    onSuccess: (data: LoginStudentResponse) => {
      if (data.status === "success" && data.result?.token) {
        if (!data.result.active) {
          setOpened(true);
          return;
        }

        localStorage.removeItem("student_id");
        localStorage.removeItem("token");
        localStorage.removeItem("firstname");
        Cookie.set(ACCESS_TOKEN_COOKIE_NAME, data.result.token, { expires: 7 });
        localStorage.setItem("student_id", data.result.id.toString());
        localStorage.setItem("token", data.result.token);
        localStorage.setItem("firstname", data.result.firstname);

        if (data.result.change_pwd) {
          router.push(
            `/recover-student-password?studentId=${data.result.id}&token=${data.result.token}`
          );
        } else {
          router.push(`/home-student?firstname=${data.result.firstname}`);
        }
      } else {
        setErrorMessage("Échec de la connexion ou token manquant.");
      }
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Erreur inconnue.");
    },
  });

  const onSubmit = (data: LoginStudentCredentials) => {
    console.log("Tentative de connexion avec les données:", data);
    mutation.mutate(data);
  };

  const handleCloseModal = () => {
    closeModal();
  };

  const handleValidate = () => {
    closeModal();
    router.back();
  };

  return (
    <div className="flex items-center justify-center min-h-dvh w-full p-4">
      <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-2xl">
        <div className="flex flex-col items-center gap-2">
          <Image src={student} alt="Student icon" width={150} height={150} />
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-2">Espace étudiant</h1>
            <p className="text-shatibi-grey font-normal">
              Connectez-vous sur votre <br />
              espace personnel
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full font-medium"
        >
          <input
            className={clsx(INPUT_CLASSNAMES, {
              "border border-red-600 placeholder:text-red-600": errorMessage,
            })}
            {...register("login")}
            type="text"
            placeholder="Identifiant"
          />
          <input
            className={clsx(INPUT_CLASSNAMES, {
              "border border-red-600 placeholder:text-red-600": errorMessage,
            })}
            type="password"
            autoComplete="current-password"
            placeholder="Mot de passe"
            {...register("password")}
          />

          {errorMessage !== "" ? (
            <p className="text-red-600 font-semibold">{errorMessage}</p>
          ) : null}

          <Button type="submit" className="w-10/12 self-center font-bold mt-1">
            Se connecter
          </Button>
          <Link href="/recoverPassword" legacyBehavior>
            <a className="self-center text-shatibi-grey font-normal">
              Mot de passe oublié ?
            </a>
          </Link>
        </form>
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
      <Modal
        opened={opened}
        onClose={closeModal}
        withCloseButton={false}
        radius="lg"
        centered
      >
        <AccessDeniedModal
          onValidate={handleValidate}
          onClickCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default StudentLoginPage;
