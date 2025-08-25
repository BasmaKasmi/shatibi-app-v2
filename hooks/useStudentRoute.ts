import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cleanupTokens } from "@/lib/backend-api";

export function useStudentRoute(): void {
  const router = useRouter();

  useEffect(() => {
    cleanupTokens();

    if (!localStorage.getItem("token")) {
      console.log("Redirection: token étudiant manquant");
      router.push("/student-login");
    }
  }, [router]);
}
