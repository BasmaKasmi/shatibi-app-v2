import axios from "axios";
import Cookies from "js-cookie";
import { Capacitor } from "@capacitor/core";

const getStoredToken = (key: string): string | null => {
  try {
    if (Capacitor.isNativePlatform()) {
      const token = localStorage.getItem(key);
      return token;
    }
    const token = Cookies.get(key) || null;
    return token;
  } catch (error) {
    return null;
  }
};

const setStoredToken = (key: string, value: string): void => {
  try {
    if (Capacitor.isNativePlatform()) {
      localStorage.setItem(key, value);
    } else {
      Cookies.set(key, value);
    }
  } catch (error) {}
};

const removeStoredToken = (key: string): void => {
  try {
    if (Capacitor.isNativePlatform()) {
      localStorage.removeItem(key);
    } else {
      Cookies.remove(key);
    }
  } catch (error) {}
};

const BackendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
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
  const result = !!url && url.includes("/student/");
  return result;
};

const isTeacherRoute = (url: string | undefined): boolean => {
  if (!url) return false;

  const result =
    TEACHER_ONLY_ROUTES.some((route) => url.includes(route)) ||
    url.includes("/teacher/");
  return result;
};

export const checkIfUserIsStudent = (): boolean => {
  if (typeof window !== "undefined") {
    const hasTeacherToken = !!getStoredToken(ACCESS_TOKEN_COOKIE_NAME);
    const hasStudentToken = !!localStorage.getItem("token");
    const currentPath = window.location.pathname;

    if (hasStudentToken && !hasTeacherToken) {
      return true;
    }

    if (hasTeacherToken && !hasStudentToken) {
      return false;
    }

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

    if (currentPath === "/home" && hasTeacherToken) {
      return false;
    }

    if (teacherPaths.some((path) => currentPath.includes(path))) {
      return false;
    }

    if (studentPaths.some((path) => currentPath.includes(path))) {
      return true;
    }

    try {
      const userInfoStored = localStorage.getItem("UserInfo");
      if (userInfoStored) {
        const userInfo = JSON.parse(userInfoStored);

        if (userInfo.role === "teacher") {
          return false;
        }
        if (
          userInfo.role === "student" ||
          (userInfo.child?.access === "oui" &&
            (!userInfo.adult || userInfo.adult.access !== "oui"))
        ) {
          return true;
        }
      }
    } catch (e) {}

    const result = !hasTeacherToken;
    return result;
  }

  return false;
};

export const cleanupTokens = (): void => {
  if (typeof window === "undefined") return;

  try {
    const currentPath = window.location.pathname;
    const hasStudentToken = !!localStorage.getItem("token");
    const hasTeacherToken = !!getStoredToken(ACCESS_TOKEN_COOKIE_NAME);

    if (hasStudentToken && hasTeacherToken) {
      const studentPaths = [
        "/student",
        "/student-",
        "/home-student",
        "/c-seance-etudiants",
        "/calendrier-etudiant",
        "/students-groups",
        "/homework-list",
      ];

      if (studentPaths.some((path) => currentPath.startsWith(path))) {
        removeStoredToken(ACCESS_TOKEN_COOKIE_NAME);
        removeStoredToken("refresh_token");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("student_id");
      }
    }
  } catch (error) {}
};

const getStudentToken = (): string | null => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token;
};

BackendApi.interceptors.request.use(
  function (config) {
    try {
      cleanupTokens();
      const isStudentSpace = checkIfUserIsStudent();

      if (isStudentSpace && isTeacherRoute(config.url)) {
        return Promise.reject(
          new Error(`API enseignant non autorisée: ${config.url}`)
        );
      }

      if (STUDENT_TOKEN_BODY_ROUTES.some((route) => config.url === route)) {
        return config;
      }

      if (isStudentRoute(config.url)) {
        const localToken = getStudentToken();
        if (localToken) {
          config.headers.Authorization = `Bearer ${localToken}`;
        } else {
        }
      } else {
        const cookieToken = getStoredToken(ACCESS_TOKEN_COOKIE_NAME);
        if (cookieToken) {
          config.headers.Authorization = `Bearer ${cookieToken}`;
        } else {
        }
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
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
    if (error.message?.includes("API enseignant non autorisée")) {
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

        if (typeof window !== "undefined") {
          setTimeout(() => {
            window.location.pathname = "/student-login";
          }, 100);
        }
        return Promise.reject(error);
      }

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const studentSpacePaths = ["/student", "student-", "/home-student"];

        if (studentSpacePaths.some((path) => currentPath.includes(path))) {
          return Promise.reject(error);
        }
      }

      const refreshToken = getStoredToken("refresh_token");
      if (refreshToken && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/refresh-token`,
            { refresh_token: refreshToken },
            { timeout: 15000 }
          );

          const newToken = refreshResponse.data.token;
          setStoredToken(ACCESS_TOKEN_COOKIE_NAME, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return BackendApi(originalRequest);
        } catch (refreshError) {
          removeStoredToken(ACCESS_TOKEN_COOKIE_NAME);
          removeStoredToken("refresh_token");

          if (typeof window !== "undefined") {
            setTimeout(() => {
              window.location.pathname = "/login";
            }, 100);
          }
          return Promise.reject(error);
        }
      } else {
        removeStoredToken(ACCESS_TOKEN_COOKIE_NAME);
        removeStoredToken("refresh_token");

        if (typeof window !== "undefined") {
          setTimeout(() => {
            window.location.pathname = "/login";
          }, 100);
        }
      }
    }

    return Promise.reject(error);
  }
);

export const getIOSDebugLogs = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem("ios_debug_logs") || "[]");
  } catch {
    return [];
  }
};

export const clearIOSDebugLogs = (): void => {
  try {
    localStorage.removeItem("ios_debug_logs");
  } catch (e) {
    console.warn("Impossible de vider les logs:", e);
  }
};

export default BackendApi;
export { getStoredToken, setStoredToken, removeStoredToken };
