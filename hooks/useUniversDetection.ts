"use client";
import React from "react";
import { useLocalStorage } from "react-use";
import { useTeacher } from "../app/TeacherContext";
import {
  LOCAL_STORAGE_SELECTED_UNIVERS_KEY,
  LOCAL_STORAGE_USER_INFO_KEY,
} from "@/lib/local-storage-keys";

const UniversContext = React.createContext({
  selectedUnivers: "adult" as string,
  setSelectedUnivers: (univers: string) => {},
});

export function UniversDetectionProvider(props: { children: React.ReactNode }) {
  const [userInfoStored] = useLocalStorage<string | undefined>(
    LOCAL_STORAGE_USER_INFO_KEY,
    undefined
  );

  const [localUnivers, setLocalUnivers] = React.useState<string>("adult");

  const [storedUnivers, setStoredUnivers] = useLocalStorage<string>(
    LOCAL_STORAGE_SELECTED_UNIVERS_KEY,
    "adult"
  );

  React.useEffect(() => {
    if (storedUnivers) {
      setLocalUnivers(storedUnivers);
    }
  }, [storedUnivers]);

  const { setTeacherId } = useTeacher();

  const setSelectedUnivers = (univers: string) => {
    setLocalUnivers(univers);
    setStoredUnivers(univers);
  };

  React.useEffect(() => {
    if (userInfoStored) {
      try {
        const userInfo = JSON.parse(userInfoStored);
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
          setSelectedUnivers("child");
          if (userInfo.child.info) {
            setTeacherId(userInfo.child.info.id);
          }
        } else if (hasValidAdultInfo && !hasValidChildInfo) {
          setSelectedUnivers("adult");
          if (userInfo.adult.info) {
            setTeacherId(userInfo.adult.info.id);
          }
        } else if (hasValidAdultInfo && hasValidChildInfo && localUnivers) {
          const currentUniversInfo = userInfo[localUnivers];
          if (currentUniversInfo && currentUniversInfo.info) {
            setTeacherId(currentUniversInfo.info.id);
          }
        }
      } catch (error) {
        console.error("Error detecting universes:", error);
      }
    }
  }, [userInfoStored, localUnivers, setTeacherId]);

  return React.createElement(
    UniversContext.Provider,
    { value: { selectedUnivers: localUnivers, setSelectedUnivers } },
    props.children
  );
}

export function useUniversDetection() {
  return React.useContext(UniversContext);
}
