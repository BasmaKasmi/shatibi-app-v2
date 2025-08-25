"use client";
import abstract from "@/public/assets/abstract-icon.svg";
import homework from "@/public/assets/homework-icon.svg";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BottomMenu from "@/components/BottomMenu";
import EvaluationHeader from "@/components/EvaluationHeader";
import FloatingMenu from "@/components/FloatingMenu";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Group, getGroups } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useTeacher } from "@/app/TeacherContext";
import { sortGroupsByDayAndTime } from "@/lib/dates";
import liaison from "@/public/assets/liaison.svg";
import individualHomework from "@/public/assets/individualHomework.svg";

type NavigationMode = "resume" | "devoir";

const ClassManagementPage = () => {
  const router = useRouter();
  const { teacherId } = useTeacher();
  const [group, setGroup] = useState<Group | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const groupIdFromUrl = searchParams.get("groupId");

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

      if (groupIdFromUrl) {
        const selectedGroup = sortedGroups.find(
          (g) => g.id.toString() === groupIdFromUrl
        );
        if (selectedGroup) {
          setGroup(selectedGroup);
          return;
        }
      }

      if (sortedGroups.length > 0) {
        setGroup(sortedGroups[0]);
      }
    }
  }, [groups, isLoading, isError, groupIdFromUrl]);

  const getRequiredFeatures = () => {
    if (!group) return [];

    const features = [];

    if (group.abstract_required) {
      features.push({
        key: "abstract",
        title: "Résumé du cours",
        icon: abstract,
        onClick: () => navigateToResumeWeeksPage(),
      });
    }

    if (group.workbook_required) {
      features.push({
        key: "workbook",
        title: "Devoir Collectif",
        icon: homework,
        onClick: () => navigateToWeeksPage("devoir"),
      });
    }

    if (group.liaison_required) {
      features.push({
        key: "liaison",
        title: "Carnet de liaison",
        icon: liaison,
        onClick: () => navigateToDatesPage("liaison"),
      });
    }

    if (group.homework_required) {
      features.push({
        key: "homework",
        title: "Devoir individuel",
        icon: individualHomework,
        onClick: () => navigateToDatesPage("homework"),
      });
    }

    return features;
  };

  const handleBackClick = () => {
    router.push("/cahier-seances/groups-page?noAutoRedirect=true");
  };

  const navigateToWeeksPage = (mode: NavigationMode) => {
    if (group) {
      router.push(
        `weeks-page?groupId=${group.id}&groupName=${encodeURIComponent(
          group.name
        )}&groupSlot=${encodeURIComponent(group.slot)}&mode=${mode}`
      );
    } else {
      router.push("/cahier-seances/groups-page");
    }
  };

  const navigateToResumeWeeksPage = () => {
    if (group) {
      router.push(
        `resume-weeks?groupId=${group.id}&groupName=${encodeURIComponent(
          group.name
        )}&groupSlot=${encodeURIComponent(group.slot)}`
      );
    } else {
      router.push("/cahier-seances/groups-page");
    }
  };

  const navigateToDatesPage = (mode: "liaison" | "homework") => {
    if (group) {
      router.push(
        `/cahier-seances/dates-page?groupId=${
          group.id
        }&groupName=${encodeURIComponent(
          group.name
        )}&groupSlot=${encodeURIComponent(
          group.slot
        )}&mode=${mode}&correspondenceMode=${mode}`
      );
    } else {
      router.push("/cahier-seances/groups-page");
    }
  };

  const requiredFeatures = getRequiredFeatures();

  if (isLoading || !group) {
    return (
      <div className="h-dvh flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (isError) {
    return <div>Erreur: {error.message}</div>;
  }

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden md:hidden">
      <div className="px-5 py-3 flex justify-between items-center mb-5">
        <EvaluationHeader
          title="Gestion de classe"
          onBackClick={handleBackClick}
        />
        <FloatingMenu />
      </div>
      <div className="px-5 mt-0">
        {requiredFeatures.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 mt-6">
            {requiredFeatures.map((feature) => (
              <div
                key={feature.key}
                className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between h-48"
                onClick={feature.onClick}
              >
                <div className="flex items-center justify-center h-28">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <p className="font-bold text-center text-sm mt-2">
                  {feature.title}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-10">
            <p className="text-gray-500">
              Aucune fonctionnalité obligatoire pour ce groupe.
            </p>
          </div>
        )}
      </div>
      <BottomMenu />
    </div>
  );
};

export default ClassManagementPage;
