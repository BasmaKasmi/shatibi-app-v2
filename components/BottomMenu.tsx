"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import group from "@/public/group.svg";
import dashboard from "@/public/assets/home.svg";
import attendance from "@/public/attendance-icon.svg";
import caseIcon from "@/public/assets/case.svg";
import sessionNotebook from "@/public/assets/c-seance.svg";

const menuItems = [
  { href: "/groups/groups-page", name: "Groupes", icon: group },
  { href: "/emargement/groups-page", name: "Emargements", icon: attendance },
  { href: "/home", name: "Accueil", icon: dashboard },
  { href: "/avis-passage/groups-page", name: "Évaluations", icon: caseIcon },
  {
    href: "/cahier-seances/groups-page",
    name: "Gestion",
    icon: sessionNotebook,
  },
];

const BottomMenu = () => {
  const currentPath = usePathname();

  return (
    <div className="fixed bottom-0 w-full flex justify-center items-center py-4 border-t">
      <div className="flex justify-around w-full max-w-md">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center ${
              currentPath === item.href
                ? "text-shatibi-orange font-bold"
                : "text-gray-700"
            }`}
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomMenu;
