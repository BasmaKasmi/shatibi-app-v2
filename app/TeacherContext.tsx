"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useLocalStorage } from "react-use";

const LOCAL_STORAGE_TEACHER_ID_KEY = "teacherId";
const LOCAL_STORAGE_SELECTED_UNIVERS_KEY = "selectedUnivers";

type TeacherContextType = {
  teacherId: number | null;
  setTeacherId: (id: number | null) => void;
  currentUnivers: string;
  setCurrentUnivers: (univers: string) => void;
  resetTeacherContext: () => void;
};

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

type TeacherProviderProps = {
  children: ReactNode;
};

export const TeacherProvider = ({ children }: TeacherProviderProps) => {
  const [storedTeacherId, setStoredTeacherId] = useLocalStorage<
    string | undefined
  >(LOCAL_STORAGE_TEACHER_ID_KEY, undefined);

  const [teacherId, setTeacherIdInternal] = useState<number | null>(
    storedTeacherId ? Number.parseInt(storedTeacherId) : null
  );

  const [storedUnivers, setStoredUnivers] = useLocalStorage<string>(
    LOCAL_STORAGE_SELECTED_UNIVERS_KEY,
    "adult"
  );

  const [currentUnivers, setCurrentUniversInternal] = useState<string>(
    storedUnivers || "adult"
  );

  const setTeacherId = (id: number | null) => {
    setTeacherIdInternal(id);
    if (id) {
      setStoredTeacherId(id.toString());
    } else {
      setStoredTeacherId(undefined);
    }
  };

  const setCurrentUnivers = (univers: string) => {
    setCurrentUniversInternal(univers);
    setStoredUnivers(univers);
  };

  const resetTeacherContext = () => {
    setTeacherIdInternal(null);
    setCurrentUniversInternal("adult");
    setStoredTeacherId(undefined);
    setStoredUnivers("adult");
  };

  useEffect(() => {
    if (storedUnivers) {
      setCurrentUniversInternal(storedUnivers);
    }

    if (storedTeacherId) {
      const parsedId = Number.parseInt(storedTeacherId);
      if (!isNaN(parsedId)) {
        setTeacherIdInternal(parsedId);
      } else {
        setTeacherIdInternal(null);
        setStoredTeacherId(undefined);
      }
    }
  }, [storedUnivers, storedTeacherId]);

  return (
    <TeacherContext.Provider
      value={{
        teacherId,
        setTeacherId,
        currentUnivers,
        setCurrentUnivers,
        resetTeacherContext,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacher must be used within a TeacherProvider");
  }
  return context;
};
