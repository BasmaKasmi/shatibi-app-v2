"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import FeuilleEmargement from "./FeuilleEmargement";
import { TitleDate, extractTimeFromSlot } from "@/lib/dates";
import { useGroup } from "@/hooks/useGroup";

export const GroupDetailsWithAttendanceSheet = () => {
  const search = useSearchParams();
  const groupId = Number(search.get("groupId"));
  const date = search.get("date") || "";
  const groupName = search.get("groupName") || "";
  const groupSlot = search.get("groupSlot") || "";

  const { studentsForDate, isLoadingForDate, groupsStatistics } = useGroup({
    groupId,
    date,
  });

  if (!(date && groupId)) {
    return (
      <p>The group id and date should be specified as search params in url</p>
    );
  }

  return (
    <>
      {groupName && groupSlot && (
        <div className="-mt-3">
          <h1 className="text-xl font-bold text-center">{groupName}</h1>
          <p className="text-md font-semibold text-center">
            {date ? `${TitleDate(date)} ` : ""}
            {extractTimeFromSlot(groupSlot)}
          </p>
        </div>
      )}

      <FeuilleEmargement
        groupId={groupId}
        date={date}
        groupName={groupName}
        groupSlot={groupSlot}
      />
    </>
  );
};
