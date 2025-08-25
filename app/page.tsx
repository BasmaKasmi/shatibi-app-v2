"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import prof from "@/public/assets/prof.svg";
import student from "@/public/assets/student.svg";
import SectionTitle from "@/components/SectionTitle";
import { useRouter } from "next/navigation";

const ChoixEspacePage = () => {
  const router = useRouter();

  const handleNavigationProf = () => {
    router.push("/login");
  };

  const handleNavigationEtudiant = () => {
    router.push("/student-login");
  };

  return (
    <div className="h-dvh flex flex-col relative overflow-hidden">
      <div className="mt-8">
        <SectionTitle title="Choix de l'espace" />
      </div>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-8">
          <div
            onClick={handleNavigationProf}
            className="flex flex-col items-center bg-white h-56 w-72 rounded-lg shadow-lg py-4 cursor-pointer"
          >
            <Image
              src={prof}
              alt="Espace professeur"
              width={150}
              height={150}
            />
            <p className="text-center mt-2">Espace professeur</p>
          </div>

          <div
            onClick={handleNavigationEtudiant}
            className="flex flex-col items-center bg-white h-56 w-72 rounded-lg shadow-lg py-4 cursor-pointer"
          >
            <Image
              src={student}
              alt="Espace étudiant"
              width={150}
              height={150}
            />
            <p className="text-center mt-2">Espace étudiant</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative flex flex-col items-center">
          <Image
            src="/logo-shatibi.png"
            alt="Logo Shatibi"
            width={100}
            height={100}
          />
          <p className="text-sm text-shatibi-grey text-center ml-6">v1.2</p>
        </div>
      </div>
    </div>
  );
};

export default ChoixEspacePage;
