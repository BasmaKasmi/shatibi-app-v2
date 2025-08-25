"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type AbsenceType = "RJ" | "AP" | "AE";

type AbsenceOption = {
  type: AbsenceType;
  label: string;
};

type DropdownProps = {
  studentId: number;
  groupId: number;
  date: string;
  onAbsenceChange: (type: AbsenceType) => void;
  className?: string;
};

const DropdownMenu = ({
  studentId,
  groupId,
  date,
  onAbsenceChange,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const absenceOptions: AbsenceOption[] = [
    { type: "RJ", label: "Déclarer un retard" },
    { type: "AP", label: "Déclarer en abs. prévue" },
    { type: "AE", label: "Déclarer en exclusion" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (event: React.MouseEvent, type: AbsenceType) => {
    event.stopPropagation();
    onAbsenceChange(type);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="w-10 h-10 flex items-center justify-center rounded-lg translate-y-0.5"
        >
          <Image
            src="/assets/down-button.svg"
            alt={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            width={24}
            height={24}
            className={`transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      )}
      {isOpen && (
        <div className="absolute right-0 top-0 w-52 bg-white rounded-lg shadow-lg z-50">
          <div className="flex flex-col">
            <div className="flex justify-end">
              <button
                onClick={handleToggle}
                className="w-10 h-10 flex items-center justify-center rounded-lg"
              >
                <Image
                  src="/assets/down-button.svg"
                  alt="Fermer le menu"
                  width={24}
                  height={24}
                  className="transform rotate-180"
                />
              </button>
            </div>
            <div>
              <div className="flex flex-col gap-2 px-4 py-3">
                {absenceOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={(event) => handleOptionClick(event, option.type)}
                    className="w-full text-left py-2 text-sm text-black font-bold flex items-center"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
