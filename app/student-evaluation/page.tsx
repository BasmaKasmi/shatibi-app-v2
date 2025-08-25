"use client";

import { getStudentsGroups } from "@/lib/student-api";
import BottomMenuStudent from "@/components/BottomMenuStudent";
import SectionTitle from "@/components/SectionTitle";
import { QUERY_KEY } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { sortGroupsByDayAndTime } from "@/lib/dates";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function StudentEvaluation() {
  const router = useRouter();

  const [studentId, setStudentId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const storedStudentId = localStorage.getItem("student_id");
    const storedToken = localStorage.getItem("token");

    if (storedStudentId && storedToken) {
      setStudentId(Number(storedStudentId));
      setToken(storedToken);
    } else {
      router.push("/student-login");
    }
  }, [router]);

  const {
    data: groupsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QUERY_KEY.STUDENTS_GROUPS, studentId],
    queryFn: async () => {
      if (!studentId || !token) {
        throw new Error("Student ID et token sont requis");
      }
      const response = await getStudentsGroups(studentId, token);
      return response;
    },
    enabled: !!studentId && !!token,
  });

  if (!studentId) {
    return <div>Invalid Student ID</div>;
  }

  if (isLoading) return <div>Chargement...</div>;

  if (isError) return <div>Erreur: {error.message}</div>;

  const groups = groupsData?.result?.group_list || [];
  const sortedGroups = groups ? sortGroupsByDayAndTime(groups) : [];

  return (
    <div className="md:hidden overflow-hidden">
      <div className="h-dvh flex flex-col gap-3 relative">
        <div className="pt-3">
          <SectionTitle title="Evaluations" />
        </div>

        <div className="flex flex-col p-5 gap-3 flex-grow pt-10">
          <div className="pl-3"></div>
        </div>
      </div>
      <BottomMenuStudent />
    </div>
  );
}
