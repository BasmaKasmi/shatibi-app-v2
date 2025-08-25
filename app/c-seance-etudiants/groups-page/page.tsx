"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import BottomMenuStudent from "@/components/BottomMenuStudent";
import { getStudentsGroups } from "@/lib/student-api";
import { QUERY_KEY } from "@/lib/queries";
import { formatDayToThreeLetters, sortGroupsByDayAndTime } from "@/lib/dates";
import SectionTitle from "@/components/SectionTitle";
import FloatingMenu from "@/components/FloatingMenu";
import StudentRouteGuard from "@/components/StudentRouteGuard";

const GroupsPage = () => {
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
      console.log("API Response:", response);
      return response;
    },
    enabled: !!studentId && !!token,
  });

  console.log(groupsData);

  if (!studentId) {
    return <div>Invalid Student ID</div>;
  }

  if (isLoading) return <div>Chargement...</div>;

  if (isError) return <div>Erreur: {error.message}</div>;

  const groups = groupsData?.result?.group_list || [];
  const sortedGroups = groups ? sortGroupsByDayAndTime(groups) : [];

  return (
    <StudentRouteGuard>
      <div className="h-dvh flex flex-col gap-3 relative overflow-hidden">
        <FloatingMenu />

        <div className="pt-3">
          <SectionTitle title="Cahiers de séance" />
        </div>

        <div className="flex flex-col mt-2 overflow-y-auto max-h-[80vh]">
          {sortedGroups.map((group) => (
            <div
              key={group.id}
              onClick={() =>
                router.push(
                  `seance-weeks-page?groupId=${group.id}&groupName=${group.name}&groupSlot=${group.slot}&studentId=${studentId}&token=${token}`
                )
              }
              className="px-6 py-2 bg-white shadow-md rounded-lg w-[90%] mb-3 mx-auto"
            >
              <p className="text-[14px] font-semibold">
                {group.name || "Nom du cours indisponible"}
              </p>
              <p className="text-xs font-light">
                {formatDayToThreeLetters(group.slot)}
              </p>
            </div>
          ))}
          {!groups.length && <div>Pas de groupes à afficher</div>}
        </div>
        <BottomMenuStudent />
      </div>
    </StudentRouteGuard>
  );
};

export default GroupsPage;
