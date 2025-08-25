"use client";
import React from "react";
import clsx from "clsx";

type StatusValue = boolean | string | undefined;
type StatusSize = "small" | "default" | "large";
type StatusVariant = "green" | "red" | "orange" | "blue" | "custom";

interface StatusBadgeProps {
  status?: StatusValue;
  className?: string;
  size?: StatusSize;
  variant?: StatusVariant;
  onClick?: () => void;
  completedText?: string;
  notCompletedText?: string;
  customClasses?: {
    completed?: string;
    notCompleted?: string;
  };
  ratio?: number;
  showRatio?: boolean;
  homework?: string;
  showOnlyWhenFilled?: boolean;
}

const getVariantFromRatio = (ratio: number): StatusVariant => {
  const percentage = ratio * 100;
  if (percentage >= 0 && percentage <= 49) {
    return "red";
  } else if (percentage >= 50 && percentage <= 70) {
    return "orange";
  } else if (percentage >= 71 && percentage <= 100) {
    return "green";
  }
  return "red";
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
  size = "default",
  variant,
  onClick,
  completedText = "Fait",
  notCompletedText = "Non fait",
  customClasses,
  ratio,
  showRatio = false,
  homework,
  showOnlyWhenFilled = false,
}) => {
  const isCompleted = variant
    ? variant === "green"
    : typeof status === "boolean"
    ? status
    : ["Fait", "Rempli"].includes(status as string);

  const isHomeworkEmpty = (hw?: string): boolean => {
    return !hw || hw.trim() === "" || hw === "NA";
  };

  const getSpecialStatus = (): {
    text: string;
    variant: StatusVariant;
  } | null => {
    if (ratio === 0) {
      if (!isHomeworkEmpty(homework)) {
        return { text: "Transmis", variant: "green" };
      } else {
        return { text: "Remplir", variant: "blue" };
      }
    }
    return null;
  };

  const getDisplayText = () => {
    const specialStatus = getSpecialStatus();
    if (specialStatus) {
      return specialStatus.text;
    }
    if (showRatio && ratio !== undefined) {
      return `${(ratio * 100).toFixed(0)}%`;
    }
    return isCompleted ? completedText : notCompletedText;
  };

  const statusText = getDisplayText();

  if (showOnlyWhenFilled && !isCompleted) {
    return null;
  }

  const isStandardText = (): boolean => {
    return ["Fait", "Non fait", "Rempli"].includes(statusText);
  };

  const getSizeClasses = () => {
    const specialStatus = getSpecialStatus();
    const isSpecialText = specialStatus !== null;

    const baseClasses =
      "px-3 py-1 text-center flex items-center justify-center";

    const isTextStandard = isStandardText() || isSpecialText;

    switch (size) {
      case "small":
        return clsx(
          baseClasses,
          "text-xs py-0.5",
          isTextStandard ? "w-[75px]" : "w-[70px]"
        );
      case "default":
        return clsx(
          baseClasses,
          "text-sm",
          isTextStandard ? "w-[80px]" : "w-[80px]"
        );
      case "large":
        return clsx(
          baseClasses,
          "text-base py-2",
          isTextStandard ? "w-[90px]" : "w-[90px]"
        );
      default:
        return clsx(
          baseClasses,
          "text-sm",
          isTextStandard ? "w-[80px]" : "w-[80px]"
        );
    }
  };

  const getVariantClasses = () => {
    if (customClasses) {
      return isCompleted ? customClasses.completed : customClasses.notCompleted;
    }

    const specialStatus = getSpecialStatus();
    if (specialStatus) {
      switch (specialStatus.variant) {
        case "green":
          return "bg-shatibi-green/[.15] text-shatibi-green";
        case "blue":
          return "bg-shatibi-blue/[.15] text-shatibi-blue";
        default:
          return "bg-shatibi-red/[.15] text-shatibi-red";
      }
    }

    if (showRatio && ratio !== undefined) {
      const ratioVariant = getVariantFromRatio(ratio);
      switch (ratioVariant) {
        case "green":
          return "bg-shatibi-green/[.15] text-shatibi-green";
        case "orange":
          return "bg-shatibi-orange/[.15] text-shatibi-orange";
        case "red":
          return "bg-shatibi-red/[.15] text-shatibi-red";
        default:
          return "bg-shatibi-red/[.15] text-shatibi-red";
      }
    }

    if (isCompleted || statusText === "Rempli") {
      return "bg-shatibi-green/[.15] text-shatibi-green";
    } else {
      return "bg-shatibi-red/[.15] text-shatibi-red";
    }
  };

  return (
    <span
      role={onClick ? "button" : undefined}
      onClick={onClick}
      className={clsx(
        "font-semibold rounded-full inline-block",
        getSizeClasses(),
        getVariantClasses(),
        onClick && "cursor-pointer",
        className
      )}
    >
      {statusText}
    </span>
  );
};

export default StatusBadge;
