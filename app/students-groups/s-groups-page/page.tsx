"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import SessionDisplay from "@/components/SessionDisplay";
import BottomMenuStudent from "@/components/BottomMenuStudent";
import { getStudentsGroups, getStudentGroupInfo } from "@/lib/student-api";
import { QUERY_KEY } from "@/lib/queries";
import {
  formatDayToThreeLetters,
  reformatSlot,
  sortGroupsByDayAndTime,
} from "@/lib/dates";
import SectionTitle from "@/components/SectionTitle";
import Button from "@/components/Button";
import AbsenceWrapper from "@/components/AbsenceWrapper";
import FloatingMenu from "@/components/FloatingMenu";
import StudentRouteGuard from "@/components/StudentRouteGuard";

const SGroupsPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: number;
    session?: string;
    absence?: number;
    nb_ai?: number;
    presence_rate?: number;
  } | null>(null);

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

  const groupInfoQuery = useQuery({
    queryKey: [QUERY_KEY.STUDENT_GROUP_INFO, studentId, selectedGroup?.id],
    queryFn: async () => {
      if (!studentId || !token || !selectedGroup?.id) {
        throw new Error("Informations requises manquantes");
      }
      const response = await getStudentGroupInfo(
        studentId,
        selectedGroup.id,
        token
      );
      return response;
    },
    enabled: !!selectedGroup?.id && !!studentId && !!token,
  });

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
        <div className="flex flex-col h-full">
          <FloatingMenu />

          <div className="pt-3">
            <SectionTitle title="Mes groupes" />
          </div>

          <div className="flex flex-col mt-3 overflow-y-auto max-h-[80vh]">
            {sortedGroups.map((group) => {
              const [current, total] = group.session
                ?.split("/")
                .map(Number) || [0, 0];
              const isSelected = selectedGroup?.id === group.id;

              return (
                <div
                  key={group.id}
                  className={`px-6 ${
                    isSelected ? "py-6" : "py-3"
                  } bg-white border border-gray-100 shadow-md rounded-2xl w-[90%] mb-3 mx-auto`}
                  onClick={() =>
                    setSelectedGroup(
                      isSelected
                        ? null
                        : {
                            id: group.id,
                            session: group.session,
                          }
                    )
                  }
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[14px] font-semibold">
                        {group.name || "Nom du cours indisponible"}
                      </p>
                      <p className="text-xs font-light">
                        {reformatSlot(formatDayToThreeLetters(group.slot))}
                      </p>
                    </div>
                    <SessionDisplay current={current} total={total} />
                  </div>

                  {isSelected && groupInfoQuery.data?.result && (
                    <div className="mt-5 space-y-4">
                      <div className="flex items-center w-full relative">
                        {/* Trait rouge
                      <div className="absolute left-0 h-32 w-[2px] bg-red-500" />
                      <div className="absolute right-0 h-32 w-[2px] bg-red-500" />
                      */}
                        <div className="h-[1px] bg-gray-200 flex-1" />
                        <h2 className="text-sm text-gray-700 font-bold px-4">
                          Récapitulatif
                        </h2>
                        <div className="h-[1px] bg-gray-200 flex-1" />
                      </div>
                      <div className="grid grid-cols-3 text-center -mx-7">
                        {[
                          {
                            value: groupInfoQuery.data.result.absence,
                            label: "Absences",
                          },
                          {
                            value: groupInfoQuery.data.result.nb_ai,
                            label: "Abs. injustifiées",
                          },
                          {
                            value: `${groupInfoQuery.data.result.presence_rate.toFixed(
                              0
                            )}%`,
                            label: "Présence",
                          },
                        ].map((item, index) => (
                          <div key={index}>
                            <p className="text-lg font-bold">{item.value}</p>
                            <p className="text-xs text-gray-600">
                              {item.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {!groups.length && <div>Pas de groupes à afficher</div>}

            <div className="fixed bottom-12 left-0 right-0">
              <Button
                className="w-fit mx-auto mb-12 z-10"
                onClick={() => setIsModalOpen(true)}
                variant="orange"
              >
                Déclarer une absence
              </Button>
            </div>
            <AbsenceWrapper
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              studentId={studentId}
              token={token}
            />
          </div>
          <BottomMenuStudent />
        </div>
      </div>
    </StudentRouteGuard>
  );
};

export default SGroupsPage;
