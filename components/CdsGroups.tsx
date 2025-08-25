"use client";
import Image from "next/image";
import User from "@/public/search-icon.svg";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { formatDayToThreeLetters, sortGroupsByDayAndTime } from "@/lib/dates";
import { Group, getGroups } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useTeacher } from "@/app/TeacherContext";

interface SelectedGroup {
  id: string;
  name: string;
  slot: string;
}

interface CdsGroupsProps {
  onGroupSelect?: (group: SelectedGroup) => void;
}

const CdsGroups = ({ onGroupSelect }: CdsGroupsProps) => {
  const [studentName, setStudentName] = useState("");
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

  const handleGroupClick = (group: Group) => {
    if (onGroupSelect) {
      onGroupSelect({
        id: group.id.toString(),
        name: group.name,
        slot: group.slot,
      });
    }
  };

  const sortedGroups = groups ? sortGroupsByDayAndTime(groups) : [];

  return (
    <div className="relative p-2 justify-items-center flex flex-col items-center">
      <h3 className="text-center text-lg font-semibold text-black mb-8">
        Cahier de séance
      </h3>

      <div className="mb-4 bg-white rounded-xl shadow w-full flex flex-col gap-y-2 h-64 sm:h-64 md:h-96 lg:h-80 xl:h-96">
        <div className="flex gap-2 pl-4 place-items-center text-sm font-semibold mt-4">
          <Image src={User} alt="User" />
          Rechercher par groupe :
        </div>

        <div className="flex flex-col items-center gap-1 grow overflow-y-scroll">
          {sortedGroups?.map((group) => (
            <div
              onClick={() => handleGroupClick(group)}
              key={group.id}
              className="px-4 py-2 bg-white shadow-md rounded-lg w-[95%] mb-2 cursor-pointer hover:bg-gray-50"
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
    </div>
  );
};

export default CdsGroups;
