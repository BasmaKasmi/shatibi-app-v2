"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { formatDayToThreeLetters, sortGroupsByDayAndTime } from "@/lib/dates";
import { Group, getGroups } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useState, useEffect } from "react";
import { useTeacher } from "@/app/TeacherContext";
import BottomMenu from "@/components/BottomMenu";
import FloatingMenu from "@/components/FloatingMenu";
import SectionTitle from "@/components/SectionTitle";

const GroupsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noAutoRedirect = searchParams.get("noAutoRedirect") === "true";

  const { teacherId } = useTeacher();
  const [isClient, setIsClient] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    setIsClient(true);
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

  const getGroupsWithRequiredFeatures = (groups: Group[]) => {
    return groups.filter(
      (group: Group) =>
        group.workbook_required ||
        group.abstract_required ||
        group.liaison_required ||
        group.homework_required
    );
  };

  useEffect(() => {
    if (groups && groups.length > 0 && !isLoading && !isError) {
      const groupsWithRequiredFeatures = getGroupsWithRequiredFeatures(groups);
      const sortedGroups: Group[] = sortGroupsByDayAndTime(
        groupsWithRequiredFeatures
      );

      if (sortedGroups.length === 1 && !noAutoRedirect) {
        const group: Group = sortedGroups[0];
        localStorage.setItem("origin", "/cahier-seances/groups-page");
        localStorage.setItem("singleGroupRedirect", "true");

        localStorage.setItem("groupId", group.id.toString());
        localStorage.setItem("groupName", group.name || "");
        localStorage.setItem("groupSlot", group.slot || "");

        router.push(
          `/cahier-seances/class-management?groupId=${
            group.id
          }&groupName=${encodeURIComponent(
            group.name || ""
          )}&groupSlot=${encodeURIComponent(group.slot || "")}`
        );
      } else {
        setInitialCheckDone(true);
        localStorage.removeItem("singleGroupRedirect");
      }
    } else if (!isLoading && (!groups || groups.length === 0 || isError)) {
      setInitialCheckDone(true);
      localStorage.removeItem("singleGroupRedirect");
    }
  }, [groups, isLoading, isError, router, noAutoRedirect]);

  if (!isClient || isLoading || !initialCheckDone) {
    return (
      <div className="h-dvh flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (isLoading) return <div>Chargement...</div>;

  if (isError) return <div>Erreur: {error.message}</div>;

  const groupsWithRequiredFeatures = getGroupsWithRequiredFeatures(groups);
  const sortedGroups = sortGroupsByDayAndTime(groupsWithRequiredFeatures);

  const handleGroupClick = (group: Group) => {
    localStorage.setItem("origin", "/cahier-seances/groups-page");
    localStorage.removeItem("singleGroupRedirect");

    localStorage.setItem("groupId", group.id.toString());
    localStorage.setItem("groupName", group.name || "");
    localStorage.setItem("groupSlot", group.slot || "");

    router.push(
      `/cahier-seances/class-management?groupId=${
        group.id
      }&groupName=${encodeURIComponent(
        group.name || ""
      )}&groupSlot=${encodeURIComponent(group.slot || "")}`
    );
  };

  return (
    <div className="h-dvh flex flex-col relative overflow-hidden">
      <FloatingMenu />

      <div className="flex flex-col h-full">
        <div className="pt-3">
          <SectionTitle title="Mes cahiers de séance" />
        </div>
        <div className="flex flex-col mt-8 overflow-y-auto max-h-[68vh]">
          {sortedGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => handleGroupClick(group)}
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
          {sortedGroups.length === 0 && (
            <div className="px-6 py-2 text-center">
              Aucun de vos groupes n&apos;a de fonctionnalités obligatoires pour
              le cahier de séance.
            </div>
          )}
        </div>
        <BottomMenu />
      </div>
    </div>
  );
};

export default GroupsPage;
