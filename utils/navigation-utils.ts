import Cookies from "js-cookie";
import { ACCESS_TOKEN_COOKIE_NAME, cleanupTokens } from "@/lib/backend-api";

const ALLOWED_STUDENT_PATHS = [
  "/students-groups/s-groups-page",
  "/calendrier-etudiant",
  "/home-student",
  "/student-evaluation/list",
  "/c-seance-etudiants/groups-page",
];

const FORBIDDEN_STUDENT_PATHS = [
  "/avis-passage/",
  "/cahier-seances/",
  "/groups/",
  "/emargement/",
];

export const isAllowedStudentPath = (path: string): boolean => {
  if (ALLOWED_STUDENT_PATHS.includes(path)) {
    return true;
  }

  if (
    path.includes("/student") ||
    path === "/home-student" ||
    path === "/calendrier-etudiant" ||
    path.includes("/c-seance-etudiants")
  ) {
    return true;
  }

  return false;
};

export const isForbiddenStudentPath = (path: string): boolean => {
  return FORBIDDEN_STUDENT_PATHS.some((forbiddenPath) =>
    path.startsWith(forbiddenPath)
  );
};

export const safeStudentNavigation = (router: any, href: string): void => {
  console.log("Tentative de navigation sécurisée vers:", href);

  cleanupTokens();

  Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
  Cookies.remove("refresh_token");

  if (isAllowedStudentPath(href)) {
    console.log("Navigation autorisée vers:", href);
    router.push(href);
  } else if (isForbiddenStudentPath(href)) {
    console.error(
      "Tentative de navigation vers une page professeur bloquée:",
      href
    );
    router.push("/home-student");
  } else {
    console.warn("Navigation vers un chemin non reconnu:", href);
    router.push("/home-student");
  }
};
