import fs from "fs";
import React, { JSX } from "react";

interface Emargement {
  date: string;
}

export const sortEmargementsByDateDesc = (
  emargements: Emargement[]
): Emargement[] => {
  return [...emargements].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

export const formatCourseName = (courseNameFromApi: string) => {
  if (courseNameFromApi) {
    return courseNameFromApi
      .replace("An", "")
      .replace("DIS", "")
      .replace("MA", "")
      .trim();
  }
  return "";
};

export const getDayInitials = (slot: string) => {
  return slot.substr(0, 3);
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const removeLastLetter = (str: string): string => {
  if (!str) return "";
  return str.slice(0, -1);
};

export function decodeHtml(html: string) {
  if (typeof window === "undefined") {
    return html;
  }

  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export const cleanUrl = (url: string): string => {
  return url.replace(/\\/g, "");
};

export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result.split(",")[1]);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const truncateFileName = (
  fileName: string,
  maxLength: number = 20
): string => {
  if (fileName.length <= maxLength) return fileName;

  const extension = fileName.split(".").pop();
  const name = fileName.substring(0, fileName.lastIndexOf("."));
  const truncatedName = name.substring(0, maxLength - 3);

  return `${truncatedName}...${extension}`;
};

export const encodeFileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      } else {
        reject(new Error("FileReader ne retourne pas une chaîne"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Erreur lors de la lecture du fichier"));
    };

    reader.readAsDataURL(file);
  });
};

export function extrairePrenom(nomComplet: string): string {
  if (nomComplet.includes("ACHAïBOU") || nomComplet.includes("ACHAÏBOU")) {
    return "Assia";
  }

  const mots = nomComplet.split(" ");

  if (mots.length === 2) {
    const dernierMot = mots[1];
    if (
      dernierMot.charAt(0) === dernierMot.charAt(0).toUpperCase() &&
      dernierMot.slice(1) === dernierMot.slice(1).toLowerCase()
    ) {
      return dernierMot;
    }
  }

  const prenoms = mots.filter((mot) => {
    return (
      mot.charAt(0) === mot.charAt(0).toUpperCase() &&
      mot.slice(1) === mot.slice(1).toLowerCase()
    );
  });

  if (prenoms.length === 0 && mots.length > 0) {
    return mots[mots.length - 1];
  }

  return prenoms.join(" ");
}

export const formatNumber = (number: number | string) => {
  if (typeof number === "number") {
    return Math.floor(number);
  }
  return number;
};

export const formatTitleInTwoLines = (
  title: string,
  wordsPerLine: number = 3
): JSX.Element | string => {
  if (!title) return "";

  const words = title.split(" ");

  if (words.length <= wordsPerLine) {
    return title;
  }

  const firstLine = words.slice(0, wordsPerLine).join(" ");
  const secondLine = words.slice(wordsPerLine).join(" ");

  return React.createElement(
    React.Fragment,
    null,
    firstLine,
    React.createElement("br", { className: "md:hidden" }),
    React.createElement("span", null, secondLine)
  );
};

export const formatText = (text: string): string => {
  if (!text || typeof text !== "string") return "";

  const regex = /(\d+)\.\s+([^0-9.]+?)(?=\s+\d+\.|$)/g;

  return text.replace(
    regex,
    '<div class="mb-2"><span class="font-bold">$1.</span> $2</div>'
  );
};

export const cleanHtmlParagraphs = (text: string): string => {
  if (!text || typeof text !== "string") return "";

  return text.replaceAll("<p>", "").replaceAll("</p>", "<br/>").trim();
};

export const decodeHtmlEntities = (text: string): string => {
  if (!text || typeof text !== "string") return "";

  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
};
