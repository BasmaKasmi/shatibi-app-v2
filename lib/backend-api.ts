import axios from "axios";
import Cookies from "js-cookie";
import { Capacitor } from "@capacitor/core";

const getStoredToken = (key: string): string | null => {
  if (Capacitor.isNativePlatform()) {
    return localStorage.getItem(key);
  }
  return Cookies.get(key) || null;
};

const setStoredToken = (key: string, value: string): void => {
  if (Capacitor.isNativePlatform()) {
    localStorage.setItem(key, value);
  } else {
    Cookies.set(key, value);
  }
};

const removeStoredToken = (key: string): void => {
  if (Capacitor.isNativePlatform()) {
    localStorage.removeItem(key);
  } else {
    Cookies.remove(key);
  }
};

const BackendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const ACCESS_TOKEN_COOKIE_NAME = "access_token";

const STUDENT_TOKEN_BODY_ROUTES = [
  "/student/external/change/password",
  "/student/external/login",
  "/student/find/group/list",
  "/student/workbook/list/group",
  "/student/workbook/content/info",
  "/student/attendance/group/student",
  "/student/group/info",
  "/student/content/list/group",
  "/student/attendance/group",
  "/student/prepare/attendance",
  "/student/agenda/group/year",
  "/student/workbook/content/validate",
  "/student/workbook/content/document/new",
  "/student/workbook/content/document/delete",
];

const TEACHER_ONLY_ROUTES = [
  "/teacher/attendance/incoming",
  "/teacher/attendance/no/validate",
  "/teacher/group/list/year",
  "/teacher/workbook/student/list",
  "/teacher/find/student/information",
  "/teacher/attendance/set/student",
  "/teacher/attendance/set/group",
  "/teacher/attendance/student/list/group",
  "/teacher/find/student/group/list",
  "/teacher/group/abandon",
  "/teacher/find/student/last/absence",
  "/teacher/student/next/level",
  "/teacher/group/next/level",
  "/teacher/information",
  "/teacher/workbook/set/group",
  "/teacher/workbook/list/group",
  "/teacher/workbook/group/info",
  "/teacher/workbook/document/new",
  "/teacher/workbook/document/delete",
  "/teacher/attendance/prepare/student",
  "/teacher/workbook/content/info",
  "/teacher/workbook/content/set",
  "/teacher/workbook/content/document/new",
  "/teacher/workbook/content/document/delete",
  "/teacher/workbook/content/list/group",
  "/teacher/student/list",
  "/teacher/attendance/list/group",
  "/teacher/agenda/group/year",
];

const isStudentRoute = (url: string | undefined): boolean => {
  return !!url && url.includes("/student/");
};

export const checkIfUserIsStudent = (): boolean => {
  if (typeof window !== "undefined") {
    const hasTeacherToken = !!getStoredToken(ACCESS_TOKEN_COOKIE_NAME);
    const hasStudentToken = !!localStorage.getItem("token");

    if (hasStudentToken && !hasTeacherToken) {
      return true;
    }

    if (hasTeacherToken && !hasStudentToken) {
      return false;
    }
  }

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const studentPaths = [
    "/student-login",
    "/home-student",
    "/c-seance-etudiants",
    "/calendrier-etudiant",
    "/students-groups",
    "/homework-list",
    "/student-evaluation",
  ];

  const teacherPaths = [
    "/login",
    "/groups/",
    "/emargement/",
    "/avis-passage/",
    "/agenda/calendar-page",
    "/agenda/",
    "/cahier-seances/",
    "/evaluations",
    "/liste-etudiants",
    "/unmade-attendance",
  ];

  if (
    currentPath === "/home" &&
    typeof window !== "undefined" &&
    getStoredToken(ACCESS_TOKEN_COOKIE_NAME)
  ) {
    return false;
  }

  if (teacherPaths.some((path) => currentPath.includes(path))) {
    return false;
  }

  if (studentPaths.some((path) => currentPath.includes(path))) {
    return true;
  }

  if (typeof window !== "undefined") {
    const userInfoStored = localStorage.getItem("UserInfo");
    if (userInfoStored) {
      try {
        const userInfo = JSON.parse(userInfoStored);
        if (userInfo.role === "teacher") {
          return false;
        }
        if (
          userInfo.role === "student" ||
          (userInfo.child &&
            userInfo.child.access === "oui" &&
            (!userInfo.adult || userInfo.adult.access !== "oui"))
        ) {
          return true;
        }
      } catch (e) {
        console.error("Erreur lors de la lecture de UserInfo", e);
      }
    }
  }

  if (typeof window !== "undefined") {
    return !getStoredToken(ACCESS_TOKEN_COOKIE_NAME);
  }

  return false;
};

export const cleanupTokens = (): void => {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname;

  if (
    localStorage.getItem("token") &&
    getStoredToken(ACCESS_TOKEN_COOKIE_NAME)
  ) {
    if (
      currentPath.startsWith("/student") ||
      currentPath.startsWith("/student-") ||
      currentPath.startsWith("/home-student") ||
      currentPath.startsWith("/c-seance-etudiants") ||
      currentPath.startsWith("/calendrier-etudiant") ||
      currentPath.startsWith("/students-groups") ||
      currentPath.startsWith("/homework-list")
    ) {
      console.log(
        "Nettoyage: Suppression du token enseignant pour un étudiant"
      );
      removeStoredToken(ACCESS_TOKEN_COOKIE_NAME);
      removeStoredToken("refresh_token");
    } else {
      console.log(
        "Nettoyage: Suppression du token étudiant pour un enseignant"
      );
      localStorage.removeItem("token");
      localStorage.removeItem("student_id");
    }
  }
};

const getStudentToken = (): string | null => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

const isTeacherRoute = (url: string | undefined): boolean => {
  if (!url) return false;

  if (TEACHER_ONLY_ROUTES.some((route) => url.includes(route))) {
    return true;
  }

  return url.includes("/teacher/");
};

BackendApi.interceptors.request.use(
  function (config) {
    cleanupTokens();

    const isStudentSpace = checkIfUserIsStudent();

    if (isStudentSpace && isTeacherRoute(config.url)) {
      console.log(
        `Requête API enseignant bloquée dans l'espace étudiant: ${config.url}`
      );
      return Promise.reject(
        new Error(
          `API enseignant non autorisée dans l'espace étudiant: ${config.url}`
        )
      );
    }

    if (STUDENT_TOKEN_BODY_ROUTES.some((route) => config.url === route)) {
      return config;
    }

    if (isStudentRoute(config.url)) {
      const localToken = getStudentToken();
      if (localToken) {
        config.headers.Authorization = `Bearer ${localToken}`;
        return config;
      }
    }

    const cookieToken = getStoredToken(ACCESS_TOKEN_COOKIE_NAME);
    if (cookieToken) {
      config.headers.Authorization = `Bearer ${cookieToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

BackendApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.message &&
      error.message.includes("API enseignant non autorisée")
    ) {
      console.log("Erreur intentionnelle:", error.message);
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      const originalRequest = error.config;
      const isStudent = isStudentRoute(originalRequest.url);

      if (isStudent) {
        localStorage.removeItem("student_id");
        localStorage.removeItem("token");
        localStorage.removeItem("firstname");
        window.location.pathname = "/student-login";
        return Promise.reject(error);
      }

      if (
        window.location.pathname.includes("/student") ||
        window.location.pathname.includes("student-") ||
        window.location.pathname === "/home-student"
      ) {
        console.log(
          "Erreur API enseignant ignorée dans l'espace étudiant:",
          error.config.url
        );
        return Promise.reject(error);
      }

      const refreshToken = getStoredToken("refresh_token");
      if (refreshToken && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newTokenResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/refresh-token`,
            { refresh_token: refreshToken }
          );
          const newToken = newTokenResponse.data.token;
          setStoredToken(ACCESS_TOKEN_COOKIE_NAME, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return BackendApi(originalRequest);
        } catch (refreshError) {
          removeStoredToken(ACCESS_TOKEN_COOKIE_NAME);
          removeStoredToken("refresh_token");
          window.location.pathname = "/login";
          return Promise.reject(error);
        }
      }
      removeStoredToken(ACCESS_TOKEN_COOKIE_NAME);
      removeStoredToken("refresh_token");
      window.location.pathname = "/login";
    }

    return Promise.reject(error);
  }
);

export default BackendApi;
export { getStoredToken, setStoredToken, removeStoredToken };
