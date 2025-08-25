"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import group from "@/public/group.svg";
import dashboard from "@/public/assets/home.svg";
import attendance from "@/public/attendance-icon.svg";
import caseIcon from "@/public/assets/case.svg";
import sessionNotebook from "@/public/assets/c-seance.svg";
import { cleanupTokens, ACCESS_TOKEN_COOKIE_NAME } from "@/lib/backend-api";
import {
  safeStudentNavigation,
  isForbiddenStudentPath,
} from "@/utils/navigation-utils";

const menuItems = [
  { href: "/students-groups/s-groups-page", name: "Assiduité", icon: group },
  { href: "/calendrier-etudiant", name: "Calendrier", icon: attendance },
  { href: "/home-student", name: "Acceuil", icon: dashboard },
  { href: "/student-evaluation/list", name: "Évaluations", icon: caseIcon },
  {
    href: "/c-seance-etudiants/groups-page",
    name: "Gestion",
    icon: sessionNotebook,
  },
];

const BottomMenuStudent = () => {
  const currentPath = usePathname();
  const router = useRouter();
  useEffect(() => {
    console.log("BottomMenuStudent monté sur le chemin:", currentPath);

    cleanupTokens();

    Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
    Cookies.remove("refresh_token");

    if (isForbiddenStudentPath(currentPath)) {
      console.log(
        "Redirection: page professeur détectée dans l'espace étudiant"
      );
      router.push("/home-student");
    }

    return () => {
      console.log("BottomMenuStudent démonté depuis le chemin:", currentPath);
    };
  }, [currentPath, router]);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    console.log("Navigation demandée vers:", href);

    safeStudentNavigation(router, href);
  };

  return (
    <div className="fixed bottom-0 w-full flex justify-center items-center py-4 border-t bg-white">
      <div className="flex justify-around w-full max-w-md">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center ${
              currentPath === item.href
                ? "text-shatibi-orange font-bold"
                : "text-gray-700"
            }`}
            onClick={(e) => handleNavigation(e, item.href)}
          >
            <Image
              src={item.icon}
              alt={item.name}
              className="h-6 w-6 mb-1"
              width={20}
              height={20}
              style={{
                filter:
                  currentPath === item.href
                    ? "invert(61%) sepia(82%) saturate(747%) hue-rotate(332deg) brightness(98%) contrast(97%)"
                    : "none",
              }}
            />
            <span
              className={`text-xs ${
                currentPath === item.href
                  ? "text-shatibi-orange font-bold"
                  : "text-gray-700"
              }`}
            >
              {item.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default BottomMenuStudent;
