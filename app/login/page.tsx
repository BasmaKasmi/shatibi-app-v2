"use client";

import Button from "@/components/Button";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/backend-api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import Image from "next/image";
import prof from "@/public/assets/prof.svg";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import {
  getUserInfo,
  login,
  LoginCredentials,
  LoginResponse,
} from "@/api/index";
import { useTeacher } from "@/app/TeacherContext";
import { useLocalStorage } from "react-use";
import {
  LOCAL_STORAGE_LOGIN_KEY,
  LOCAL_STORAGE_SELECTED_UNIVERS_KEY,
  LOCAL_STORAGE_TEACHER_ID_KEY,
  LOCAL_STORAGE_USER_INFO_KEY,
} from "@/lib/local-storage-keys";

const INPUT_CLASSNAMES =
  "rounded-xl border-gray-400 border p-4 w-full w-11/12 self-center";

type Inputs = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { register, watch, handleSubmit } = useForm<Inputs>();

  const [userInfoStored, setValue] = useLocalStorage<string>(
    LOCAL_STORAGE_USER_INFO_KEY
  );
  const [storedLogin, setLogin] = useLocalStorage<string>(
    LOCAL_STORAGE_LOGIN_KEY
  );

  const { setTeacherId, resetTeacherContext } = useTeacher();

  const { mutate } = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: login,
    onSuccess: async (data) => {
      Cookie.set(ACCESS_TOKEN_COOKIE_NAME, data.token);
      const username = watch("username");
      setLogin(username);

      try {
        const userInfo = await getUserInfo(username);
        setValue(JSON.stringify(userInfo.result));

        const { adult, child } = userInfo.result;

        if (adult.access === "oui" && child.access === "oui") {
          if (!adult.info.id && child.info.id) {
            setTeacherId(child.info.id);
            router.push("/home");
          } else if (!child.info.id && adult.info.id) {
            setTeacherId(adult.info.id);
            router.push("/home");
          } else {
            router.push("/choix-univers");
          }
        } else if (adult.access === "oui" && adult.info.id) {
          setTeacherId(adult.info.id);
          router.push("/home");
        } else if (child.access === "oui" && child.info.id) {
          setTeacherId(child.info.id);
          router.push("/home");
        } else {
          throw new Error("No valid access found.");
        }
      } catch (error) {
        console.error("Error retrieving user information: ", error);
        setErrorMessage("Erreur lors de la récupération des informations.");
      }
    },
    onError: (error) => {
      console.error("Login error: ", error);
      setErrorMessage("Identifiants invalides. Veuillez réessayer.");
    },
  });

  const router = useRouter();

  const onSubmit = (data: Inputs) => {
    localStorage.removeItem(LOCAL_STORAGE_USER_INFO_KEY);
    localStorage.removeItem(LOCAL_STORAGE_LOGIN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_SELECTED_UNIVERS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TEACHER_ID_KEY);

    if (typeof resetTeacherContext === "function") {
      resetTeacherContext();
    } else {
      setTeacherId(null);
    }
    Cookie.remove(ACCESS_TOKEN_COOKIE_NAME);

    mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-dvh w-full p-4">
      <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-2xl">
        <div className="flex flex-col items-center gap-2">
          <Image src={prof} alt="Professor icon" width={150} height={150} />
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-2">Espace Professeur</h1>
            <p className="text-shatibi-grey font-normal">
              Connectez-vous et notez l&apos;assiduité de vos groupes
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
            {...register("username")}
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
    </div>
  );
};

export default LoginPage;
