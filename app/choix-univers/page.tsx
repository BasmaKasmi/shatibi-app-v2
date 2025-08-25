"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import child from "@/public/assets/child.svg";
import adult from "@/public/assets/adult.svg";
import SectionTitle from "@/components/SectionTitle";
import { useRouter } from "next/navigation";
import { useTeacher } from "../TeacherContext";
import { useLocalStorage } from "react-use";
import {
  LOCAL_STORAGE_SELECTED_UNIVERS_KEY,
  LOCAL_STORAGE_USER_INFO_KEY,
  LOCAL_STORAGE_LOGIN_KEY,
} from "@/lib/local-storage-keys";
import { getUserInfo } from "@/api";
import { useUniversDetection } from "@/hooks/useUniversDetection";

const ChoixUniversPage = () => {
  const router = useRouter();
  const { setSelectedUnivers } = useUniversDetection();
  const [storedUnivers, setStoredUnivers] = useLocalStorage<string>(
    LOCAL_STORAGE_SELECTED_UNIVERS_KEY,
    "adult"
  );

  const [userInfoStored, setUserInfoStored] = useLocalStorage<string>(
    LOCAL_STORAGE_USER_INFO_KEY
  );
  const [storedLogin] = useLocalStorage<string>(LOCAL_STORAGE_LOGIN_KEY);
  const { setTeacherId } = useTeacher();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (storedLogin) {
          const userData = await getUserInfo(storedLogin);
          setUserInfoStored(JSON.stringify(userData.result));

          const userInfo = userData.result;

          const hasValidAdultInfo =
            userInfo.adult &&
            userInfo.adult.access === "oui" &&
            userInfo.adult.info &&
            Object.keys(userInfo.adult.info).length > 0;

          const hasValidChildInfo =
            userInfo.child &&
            userInfo.child.access === "oui" &&
            userInfo.child.info &&
            Object.keys(userInfo.child.info).length > 0;

          if (!hasValidAdultInfo && hasValidChildInfo) {
            setStoredUnivers("child");
            setSelectedUnivers("child");
            setTeacherId(userInfo.child.info.id);
            router.push("/home");
          } else if (hasValidAdultInfo && !hasValidChildInfo) {
            setStoredUnivers("adult");
            setSelectedUnivers("adult");
            setTeacherId(userInfo.adult.info.id);
            router.push("/home");
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user information", error);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [
    storedLogin,
    setUserInfoStored,
    setStoredUnivers,
    setSelectedUnivers,
    setTeacherId,
    router,
  ]);

  const handleSelectUnivers = (univers: string) => {
    setStoredUnivers(univers);

    setSelectedUnivers(univers);

    if (userInfoStored) {
      const userInfo = JSON.parse(userInfoStored);
      const selectedUserInfo = userInfo[univers];
      if (
        selectedUserInfo &&
        selectedUserInfo.info &&
        selectedUserInfo.info.id
      ) {
        setTeacherId(selectedUserInfo.info.id);
      }
    }
    router.push("/home");
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="h-dvh flex flex-col relative overflow-hidden md:hidden">
      <div className="mt-3">
        <SectionTitle title="Choix de l’univers" />
      </div>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-8">
          <div
            onClick={() => handleSelectUnivers("child")}
            className="flex flex-col items-center bg-white h-56 w-72 rounded-lg shadow-lg py-4 cursor-pointer"
          >
            <Image
              src={child}
              alt="Département enfant"
              width={150}
              height={150}
            />
            <p className="text-center mt-2">Univers enfant</p>
          </div>
          <div
            onClick={() => handleSelectUnivers("adult")}
            className="flex flex-col items-center bg-white h-56 w-72 rounded-lg shadow-lg py-4 cursor-pointer"
          >
            <Image
              src={adult}
              alt="Département adulte"
              width={150}
              height={150}
            />
            <p className="text-center mt-2">Univers adulte</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <Image
          src="/logo-shatibi.png"
          alt="Logo Shatibi"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
};

export default ChoixUniversPage;
