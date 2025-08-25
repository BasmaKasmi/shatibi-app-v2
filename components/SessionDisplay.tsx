"use client";
import React from "react";

interface SessionDisplayProps {
  current: number;
  total: number;
}

const SessionDisplay = ({ current, total }: SessionDisplayProps) => {
  const percentage = (current / total) * 100;
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 34 34">
        <circle
          className="stroke-gray-200 fill-none"
          strokeWidth="3"
          r={radius}
          cx="17"
          cy="17"
        />
        <circle
          className="stroke-shatibi-green fill-none"
          strokeWidth="3"
          strokeLinecap="round"
          r={radius}
          cx="17"
          cy="17"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[0.6rem] font-bold">
          {current}/{total}
        </span>
        <span className="text-[0.4rem] font-normal">Séances</span>
      </div>
    </div>
  );
};

export default SessionDisplay;
