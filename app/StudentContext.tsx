"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface StudentContextType {
  studentId: number | null;
  token: string | null;
  setStudentData: (studentId: number, token: string) => void;
  clearStudentData: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [studentId, setStudentId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedStudentId = localStorage.getItem("studentId");
    const savedToken = localStorage.getItem("studentToken");

    if (savedStudentId && savedToken) {
      setStudentId(Number(savedStudentId));
      setToken(savedToken);
    }
  }, []);

  const setStudentData = (newStudentId: number, newToken: string) => {
    setStudentId(newStudentId);
    setToken(newToken);
    localStorage.setItem("studentId", newStudentId.toString());
    localStorage.setItem("studentToken", newToken);
  };

  const clearStudentData = () => {
    setStudentId(null);
    setToken(null);
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentToken");
  };

  return (
    <StudentContext.Provider
      value={{
        studentId,
        token,
        setStudentData,
        clearStudentData,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
