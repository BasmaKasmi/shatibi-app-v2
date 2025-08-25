"use client";

import ProfIcon from "@/public/assets/prof-icone.svg";
import StudentIcon from "@/public/assets/student-icone.svg";
import React, { useState, useEffect } from "react";
import swap from "@/public/assets/swap.svg";
import Image from "next/image";
import clsx from "clsx";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/backend-api";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { UserResponse } from "@/api/index";
import { useLocalStorage } from "react-use";
import {
  LOCAL_STORAGE_LOGIN_KEY,
  LOCAL_STORAGE_SELECTED_UNIVERS_KEY,
  LOCAL_STORAGE_USER_INFO_KEY,
} from "@/lib/local-storage-keys";
import { useDate } from "@/app/DateContext";
import { useUniversDetection } from "@/hooks/useUniversDetection";
import { LOCAL_STORAGE_TEACHER_ID_KEY } from "@/lib/local-storage-keys";
import { useTeacher } from "@/app/TeacherContext";
import { clearAllStudentDates } from "@/lib/dateUtils";

const STUDENT_ROUTES = [
  "/home-student",
  "/calendrier-etudiant",
  "/students-groups/s-groups-page",
  "/student-evaluation/list",
  "/c-seance-etudiants/groups-page",
];

const Menu = ({ close, isStudentDashboard }: any) => {
  const router = useRouter();
  const { clearAllDateSessions } = useDate();

  const { resetDates } = useDate();
  const { setTeacherId } = useTeacher();

  const [storedUnivers, setStoredUnivers] = useLocalStorage<string>(
    LOCAL_STORAGE_SELECTED_UNIVERS_KEY,
    "adult"
  );
  const { selectedUnivers, setSelectedUnivers } = useUniversDetection();

  const [userInfoStored] = useLocalStorage<any>(LOCAL_STORAGE_USER_INFO_KEY);

  const [userInfo, setUserInfo] = useState<UserResponse["result"] | null>(null);

  useEffect(() => {
    if (storedUnivers) {
      setSelectedUnivers(storedUnivers);
    }

    if (userInfoStored) {
      setUserInfo(JSON.parse(userInfoStored));
    }
  }, [storedUnivers, userInfoStored]);

  const toggleMode = () => {
    const newUnivers = selectedUnivers === "child" ? "adult" : "child";
    setStoredUnivers(newUnivers);
    setSelectedUnivers(newUnivers);
    router.push("/choix-univers");
  };

  const logout = (isStudentDashboard: boolean) => {
    clearAllStudentDates();

    clearAllDateSessions();
    resetDates();
    setTeacherId(null);

    localStorage.removeItem(LOCAL_STORAGE_USER_INFO_KEY);
    localStorage.removeItem(LOCAL_STORAGE_LOGIN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_SELECTED_UNIVERS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TEACHER_ID_KEY);

    setUserInfo(null);
    setSelectedUnivers("adult");

    Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);

    router.push(isStudentDashboard ? "/student-login" : "/login");
  };

  const hasAdultAccess =
    userInfo?.adult?.access === "oui" &&
    userInfo?.adult?.info?.id !== undefined;
  const hasChildAccess =
    userInfo?.child?.access === "oui" &&
    userInfo?.child?.info?.id !== undefined;
  const showToggleButton =
    !isStudentDashboard && hasAdultAccess && hasChildAccess;

  return (
    <div className="md:hidden">
      <div className="flex items-center"></div>
      <div className="flex flex-col items-center space-y-4">
        {showToggleButton && (
          <button
            className={`flex justify-center items-center text-center px-4 py-2 rounded-full space-x-2 w-full max-w-xs ${
              selectedUnivers === "child"
                ? "bg-shatibi-blue"
                : "bg-shatibi-purple"
            }`}
            onClick={toggleMode}
          >
            <span className="font-bold text-white">
              {selectedUnivers === "child"
                ? "Univers Adulte"
                : "Univers Enfant"}
            </span>
            <Image src={swap} alt="switch" className="w-3 h-3" />
          </button>
        )}

        <button
          className={`font-bold flex-row justify-center items-center text-center px-4 py-2 text-white bg-black rounded-full w-full max-w-xs ${
            !showToggleButton && "ml-auto"
          }`}
          onClick={() => logout(isStudentDashboard)}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

const OPEN_BUTTON_CLASSNAMES = "flex items-center justify-center";

const FloatingMenu = () => {
  const [opened, { open, close }] = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();

  const isStudentPage = STUDENT_ROUTES.includes(pathname);
  const iconToUse = isStudentPage ? StudentIcon : ProfIcon;

  return (
    <>
      <div
        className={`absolute md:hidden ${
          isStudentPage ? "-top-3" : "-top-2"
        } -right-2`}
      >
        <button
          onClick={open}
          className={clsx(OPEN_BUTTON_CLASSNAMES, { hidden: opened })}
        >
          <Image
            src={iconToUse}
            alt="open menu"
            className="text-black"
            width={80}
            height={80}
          />
        </button>
      </div>

      <Modal
        transitionProps={{ transition: "slide-left" }}
        styles={{
          inner: {
            padding: 0,
          },
          content: {
            position: "absolute",
            top: 12,
            right: 0,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
        size="70%"
        onClose={close}
        opened={opened}
        withCloseButton={false}
      >
        <Menu close={close} isStudentDashboard={isStudentPage} />{" "}
      </Modal>
    </>
  );
};

export default FloatingMenu;
