"use client";

import { useSearchParams } from "next/navigation";
import { formatSlotWithDayAndTime } from "@/lib/dates";
import EvaluationList from "@/components/EvaluationList";
import EvaluationHeader from "@/components/EvaluationHeader";

const StudentPage = () => {
  const search = useSearchParams();
  const groupId = Number(search.get("groupId"));
  const groupName = search.get("groupName");
  const groupSlot = search.get("groupSlot");

  if (!groupId) return <p>Veuillez spécifier un groupe et une date</p>;

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden md:hidden">
      <div className="px-6 py-4">
        <EvaluationHeader title="Mes évaluations" />
      </div>
      {groupName && groupSlot && (
        <div className="-mt-3">
          <h1 className="text-xl font-bold text-center">{groupName}</h1>
          <p className="text-md font-semibold text-center">
            {formatSlotWithDayAndTime(groupSlot)}
          </p>
        </div>
      )}
      <EvaluationList />
    </div>
  );
};

export default StudentPage;
