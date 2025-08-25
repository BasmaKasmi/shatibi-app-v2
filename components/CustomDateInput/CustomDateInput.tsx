"use client";
import React, { useRef } from "react";

interface DateProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const CustomDateInput: React.FC<DateProps> = ({ date, setDate }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  return (
    <div className="relative w-36">
      <input
        ref={inputRef}
        type="date"
        value={date ? date.toISOString().split("T")[0] : ""}
        onChange={(e) =>
          e.target.value
            ? setDate(new Date(e.target.value))
            : setDate(new Date())
        }
        className="w-full rounded-[10px] py-2 px-4 border border-gray-200 text-gray-700 text-sm cursor-pointer focus:outline-none"
        style={{ height: "36px" }}
        onClick={handleInputClick}
      />
    </div>
  );
};
export default CustomDateInput;
