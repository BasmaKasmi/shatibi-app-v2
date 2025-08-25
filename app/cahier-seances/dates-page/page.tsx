"use client";

import Image from "next/image";
import calendar from "@/public/calendar.svg";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { displayDate, formatSlotWithDayAndTime } from "@/lib/dates";
import clsx from "clsx";
import { getWorkbookList, Workbook, WorkbookListApiResponse } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useTeacher } from "@/app/TeacherContext";
import BottomMenu from "@/components/BottomMenu";
import useSelectedDates from "@/hooks/useSelectedDates";
import { ClassWorkTabMode } from "@/components/Classwork";
import HeaderWithPlus from "@/components/HeaderWithPlus";

function DatesPage() {
  const search = useSearchParams();
  const router = useRouter();
  const groupId = Number(search.get("groupId"));
  const groupName = search.get("groupName");
  const groupSlot = search.get("groupSlot");
  const mode = search.get("mode") as ClassWorkTabMode | null;
  const [workbookStatuses, setWorkbookStatuses] = useState<{
    [id: number]: boolean;
  }>({});

  const {
    startDate,
    endDate,
    selectorDate,
    handleStartDateChange,
    handleEndDateChange,
  } = useSelectedDates("cahier-seances");

  const { teacherId } = useTeacher();

  const {
    data: workbookList,
    isLoading,
    isError,
    error,
  } = useQuery<WorkbookListApiResponse, Error>({
    queryKey: [QUERY_KEY.WORKBOOK_LIST, groupId, startDate, endDate, teacherId],
    queryFn: () => {
      if (teacherId === null || groupId === null) {
        throw new Error("Teacher ID or Group ID is not available.");
      }
      return getWorkbookList(groupId, teacherId, startDate, endDate);
    },
    enabled: !!groupId && !!teacherId && !!startDate && !!endDate,
    retry: false,
  });

  const handleWorkbookClick = (workbook: Workbook) => {
    localStorage.setItem("selectedWorkbookDate", workbook.date);

    router.push(
      `students-list-page?groupId=${groupId}&groupName=${encodeURIComponent(
        groupName || ""
      )}&groupSlot=${encodeURIComponent(groupSlot || "")}&mode=${
        mode || "liaison"
      }&workbookId=${workbook.id}&date=${encodeURIComponent(workbook.date)}`
    );
  };

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden md:hidden">
      <div className="px-5 py-4">
        <HeaderWithPlus title="Correspondances" />
      </div>
      {groupName && groupSlot && (
        <div className="-mt-3">
          <h1 className="text-xl font-bold text-center">{groupName}</h1>
          <p className="text-md font-semibold text-center">
            {formatSlotWithDayAndTime(groupSlot)}
          </p>
        </div>
      )}
      <div className="flex flex-col mt-4 w-full">
        <div className="flex gap-2 pl-6 place-items-center">
          <Image className="mt-2" src={calendar} alt="User" />

          <label
            htmlFor="searchStudentByName"
            className="block text-sm font-semibold mt-2"
          >
            Choisir dates :
          </label>
        </div>

        <div className="flex justify-center gap-4">
          <input
            id="start_date"
            type="date"
            value={selectorDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="w-2/5 p-2 border rounded-full mt-2 text-xs text-center"
          />
          <input
            id="end_date"
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="w-2/5 p-2 px-2 border rounded-full mt-2 text-xs text-center"
          />
        </div>
      </div>
      <h2 className="md:hidden text-xl font-semibold ml-7 mt-2">Mes dates :</h2>
      <div className="flex flex-col items-center w-full flex-grow overflow-y-auto p-2 mb-20">
        {isLoading ? (
          <p className="text-center">Chargement...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Erreur: {error.message}</p>
        ) : workbookList?.result.length === 0 ? (
          <p className="text-center text-black">Aucune date trouvée</p>
        ) : (
          workbookList?.result.map((workbook) => (
            <div
              key={workbook.id}
              onClick={() => handleWorkbookClick(workbook)}
              className="bg-white px-4 py-2 rounded-lg shadow-md mt-2 w-[90%] mb-2"
            >
              <div className="flex justify-between items-center w-full">
                <p className="px-3 py-1 text-sm font-semibold">
                  {displayDate(workbook.date)}
                </p>
                <p
                  className={clsx(
                    "px-3 py-1 rounded-full text-sm font-semibold",
                    {
                      " text-shatibi-green":
                        workbookStatuses[workbook.id] !== undefined
                          ? workbookStatuses[workbook.id]
                          : workbook.validate,
                      "text-shatibi-red":
                        workbookStatuses[workbook.id] !== undefined
                          ? !workbookStatuses[workbook.id]
                          : !workbook.validate,
                    }
                  )}
                ></p>
              </div>
            </div>
          ))
        )}
      </div>
      <BottomMenu />
    </div>
  );
}

export default DatesPage;
