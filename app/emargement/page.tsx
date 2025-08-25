"use client";
import React, { Suspense, useEffect } from "react";
import { GroupDetailsWithAttendanceSheet } from "@/components/GroupDetailsWithAttendanceSheet";
import { useGroup } from "@/hooks/useGroup";
import HeaderWithRecapButton from "@/components/HeaderWithRecapButton";
import { useSearchParams } from "next/navigation";

const EmargementPage = () => {
  const search = useSearchParams();
  const groupId = Number(search.get("groupId"));
  const date = search.get("date") || "";

  useEffect(() => {
    localStorage.setItem("origin", "/emargement");
  }, []);

  const {
    studentsForDate,
    isLoadingForDate,
    statistics: groupsStatistics,
  } = useGroup({
    groupId,
    date,
  });

  return (
    <div className="h-dvh flex flex-col gap-4 relative overflow-hidden md:hidden">
      <div className="px-10 py-6">
        <HeaderWithRecapButton
          title="Effectif du groupe"
          groupRecap={groupsStatistics}
        />
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <GroupDetailsWithAttendanceSheet />
      </Suspense>
    </div>
  );
};

export default EmargementPage;
