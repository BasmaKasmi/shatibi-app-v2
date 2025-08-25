"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  checkIfUserIsStudent,
  ACCESS_TOKEN_COOKIE_NAME,
  cleanupTokens,
} from "@/lib/backend-api";
import { isForbiddenStudentPath } from "@/utils/navigation-utils";

interface StudentRouteGuardProps {
  children: React.ReactNode;
}

const StudentRouteGuard: React.FC<StudentRouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("StudentRouteGuard - vérification du chemin:", pathname);

    cleanupTokens();

    const isStudent = checkIfUserIsStudent();

    Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
    Cookies.remove("refresh_token");

    const hasStudentToken = !!localStorage.getItem("token");

    const isTeacherPage = isForbiddenStudentPath(pathname);

    if (!hasStudentToken) {
      console.log("Pas de token étudiant, redirection vers connexion");
      router.push("/student-login");
      return;
    }

    if (isTeacherPage) {
      console.log(
        "Page professeur détectée, redirection vers accueil étudiant"
      );
      router.push("/home-student");
      return;
    }

    if (!isStudent) {
      console.log("Utilisateur non étudiant, redirection vers connexion");
      router.push("/student-login");
      return;
    }
  }, [pathname, router]);

  return <>{children}</>;
};

export default StudentRouteGuard;
