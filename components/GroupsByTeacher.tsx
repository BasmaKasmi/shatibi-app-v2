"use client";
import { useQuery } from "@tanstack/react-query";
import { Group, getGroups } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { formatDayToThreeLetters, sortGroupsByDayAndTime } from "@/lib/dates";
import Image from "next/image";
import stickerVert from "@/public/assets/sticker-vert.svg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const GroupsByTeacher = ({ teacherId, destinationPage }: any) => {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

  const sortedGroups = groups ? sortGroupsByDayAndTime(groups) : [];

  if (!hasMounted) return null;

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur: {error?.message}</div>;

  return (
    <div>
      <div className="flex flex-col mt-2 overflow-y-auto max-h-[72vh] overflow-x-hidden">
        {sortedGroups.length > 0 ? (
          sortedGroups.map((group) => (
            <div
              key={group.id}
              onClick={() =>
                router.push(
                  `${destinationPage}?groupId=${group.id}&groupName=${group.name}&groupSlot=${group.slot}`
                )
              }
              className="px-6 py-2 bg-white shadow-md rounded-lg w-[90%] mb-3 mx-auto cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <p className="text-[14px] font-semibold">
                  {group.name || "Nom du cours indisponible"}
                </p>
                {window.location.pathname != "/evaluations" &&
                  group.level_valid === "1" && (
                    <Image src={stickerVert} alt="Emargement validé" />
                  )}
              </div>
              <p className="text-xs font-light">
                {formatDayToThreeLetters(group.slot)}
              </p>
            </div>
          ))
        ) : (
          <div>Pas de groupes à afficher</div>
        )}
      </div>
    </div>
  );
};

export default GroupsByTeacher;
