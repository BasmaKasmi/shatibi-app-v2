"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { formatDayToThreeLetters, sortGroupsByDayAndTime } from "@/lib/dates";
import { Group, getGroups } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useTeacher } from "@/app/TeacherContext";
import BottomMenu from "@/components/BottomMenu";
import FloatingMenu from "@/components/FloatingMenu";
import SectionTitle from "@/components/SectionTitle";

const GroupsPage = () => {
  const router = useRouter();
  const { teacherId } = useTeacher();

  const {
    data: groups = [],
    isLoading,
    isError,
    error,
  } = useQuery<Group[], Error>({
    queryKey: [QUERY_KEY.GROUPS, teacherId],
    queryFn: () => {
      if (teacherId !== null) {
        return getGroups(teacherId);
      } else {
        throw new Error("teacherId is null");
      }
    },
    enabled: teacherId !== null,
  });

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;

  const sortedGroups = groups ? sortGroupsByDayAndTime(groups) : [];

  return (
    <div className="h-dvh flex flex-col relative overflow-hidden">
      <FloatingMenu />

      <div className="flex flex-col h-full">
        <div className="pt-3">
          <SectionTitle title="Mes groupes" />
        </div>
        <div className="flex flex-col mt-8 overflow-y-auto max-h-[68vh]">
          {sortedGroups?.map((group) => (
            <div
              key={group.id}
              onClick={() =>
                // @ts-ignore
                router.push(
                  `students-page?groupId=${group.id}&groupName=${group.name}&groupSlot=${group.slot}`
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
          {!groups ||
            (groups.length === 0 && <div>Pas de groupes à afficher</div>)}
        </div>
      </div>
      <BottomMenu />
    </div>
  );
};

export default GroupsPage;
