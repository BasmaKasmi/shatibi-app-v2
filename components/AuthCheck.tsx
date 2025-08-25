"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/backend-api";
import { useLocalStorage } from "react-use";
import {
  LOCAL_STORAGE_LOGIN_KEY,
  LOCAL_STORAGE_USER_INFO_KEY,
  LOCAL_STORAGE_SELECTED_UNIVERS_KEY,
  LOCAL_STORAGE_TEACHER_ID_KEY,
} from "@/lib/local-storage-keys";
import { useTeacher } from "@/app/TeacherContext";
import { getUserInfo } from "@/api";
import { UserInfoData } from "@/utils/user";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setTeacherId } = useTeacher();
  const [isInitialized, setIsInitialized] = useState(false);

  const [userInfoStored, setUserInfoStored] = useLocalStorage<string>(
    LOCAL_STORAGE_USER_INFO_KEY
  );
  const [storedLogin, setStoredLogin] = useLocalStorage<string>(
    LOCAL_STORAGE_LOGIN_KEY
  );

  useEffect(() => {
    const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
    if (!token && (userInfoStored || storedLogin)) {
      console.log("Inconsistent auth state detected, cleaning up...");
      localStorage.removeItem(LOCAL_STORAGE_USER_INFO_KEY);
      localStorage.removeItem(LOCAL_STORAGE_LOGIN_KEY);
      localStorage.removeItem(LOCAL_STORAGE_SELECTED_UNIVERS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_TEACHER_ID_KEY);
      setUserInfoStored(undefined);
      setStoredLogin(undefined);
      setTeacherId(null);
      router.push("/login");
      return;
    }

    if (token && (!userInfoStored || !storedLogin)) {
      console.log("Token present but no user data, redirecting to login...");
      Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
      router.push("/login");
      return;
    }

    setIsInitialized(true);
  }, [userInfoStored, storedLogin]);

  useEffect(() => {
    const refreshUserData = async () => {
      if (!isInitialized || !storedLogin) return;

      const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
      if (!token) return;

      try {
        console.log("Synchronizing user data with server...");
        const userData = await getUserInfo(storedLogin);

        const storedData = userInfoStored
          ? (JSON.parse(userInfoStored) as UserInfoData)
          : null;
        const serverData = userData.result as UserInfoData;

        if (JSON.stringify(storedData) !== JSON.stringify(serverData)) {
          console.log("User data has changed, updating...");
          setUserInfoStored(JSON.stringify(serverData));

          const currentUnivers =
            localStorage.getItem(LOCAL_STORAGE_SELECTED_UNIVERS_KEY) || "adult";

          if (currentUnivers === "adult" || currentUnivers === "child") {
            if (serverData[currentUnivers]?.info?.id) {
              setTeacherId(serverData[currentUnivers].info.id);
            }
          }
        }
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      }
    };

    refreshUserData();
  }, [isInitialized, storedLogin]);

  if (!isInitialized) {
    return <div>Chargement...</div>;
  }

  return <>{children}</>;
}
