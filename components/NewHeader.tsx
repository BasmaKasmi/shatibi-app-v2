"use client";
import React from "react";
import Image from "next/image";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="w-full px-4 py-3 flex items-center justify-between bg-white">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
        <Image
          src="/assets/adulte-icone.svg"
          alt="Profile icon"
          width={24}
          height={24}
          className="text-white"
        />
      </div>
    </div>
  );
};

export default Header;
