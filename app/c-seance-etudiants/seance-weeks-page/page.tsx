"use client";

import Image from "next/image";
import calendar from "@/public/calendar.svg";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { displayDate, formatSlotWithDayAndTime, formatDate } from "@/lib/dates";
import {
  getStudentWorkbookList,
  StudentWorkbookListApiResponse,
} from "@/lib/student-api";
import { QUERY_KEY } from "@/lib/queries";
import useSelectedDates from "@/hooks/useSelectedDates";
import EvaluationHeader from "@/components/EvaluationHeader";
import { Modal } from "@mantine/core";
import CSeanceReadOnly from "@/components/CSeanceReadOnly";
import BottomMenuStudent from "@/components/BottomMenuStudent";
import StatusBadge from "@/components/StatusBadge";

interface Workbook {
  id: number;
  date: string;
  abstract: string;
  homework: string;
  abUrlList: Array<{
    name: string;
    url: string;
    mime?: string;
  }>;
  hwUrlList: Array<{
    name: string;
    url: string;
    mime?: string;
  }>;
  validate: boolean;
}

const SeanceWeeksPage = () => {
  const router = useRouter();
  const search = useSearchParams();
  const groupId = Number(search.get("groupId"));
  const date = search.get("date");
  const groupName = search.get("groupName");
  const groupSlot = search.get("groupSlot");
  const encodedGroupName = encodeURIComponent(groupName ?? "");
  const encodedGroupSlot = encodeURIComponent(groupSlot ?? "");
  const studentId = Number(search.get("studentId"));
  const token = search.get("token");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorkbook, setSelectedWorkbook] = useState<Workbook | null>(
    null
  );
  const [firstName, setFirstName] = useState<string | null>(null);

  const {
    startDate,
    endDate,
    selectorDate,
    handleStartDateChange,
    handleEndDateChange,
  } = useSelectedDates("c-seance-etudiants");
  const {
    data: workbookList,
    isLoading,
    isError,
  } = useQuery<StudentWorkbookListApiResponse, Error>({
    queryKey: [
      QUERY_KEY.STUDENT_WORKBOOK_LIST,
      studentId,
      groupId,
      startDate,
      endDate,
      token,
    ],
    queryFn: () => {
      if (!studentId || !groupId || !token || !startDate || !endDate) {
        throw new Error(
          "Student ID, Group ID, Token, or Date is not available."
        );
      }
      return getStudentWorkbookList(
        studentId,
        token,
        groupId,
        startDate,
        endDate
      );
    },
    enabled: !!studentId && !!groupId && !!token && !!startDate && !!endDate,
  });

  const cahiersValides =
    workbookList?.result.filter((workbook) => workbook.validate) || [];

  const handleWorkbookClick = (workbook: Workbook) => {
    setSelectedWorkbook(workbook);
    setModalOpen(true);
  };

  useEffect(() => {
    const storedFirstname = localStorage.getItem("firstname");
    if (storedFirstname) {
      setFirstName(storedFirstname);
    }
  }, []);

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden md:hidden">
      <div className="px-5 py-4">
        <EvaluationHeader title="Liste cahiers de séance" />
      </div>
      {groupName && groupSlot && (
        <div className="-mt-3">
          <h1 className="text-xl font-bold text-center">{groupName}</h1>
          <p className="text-md font-semibold text-center">
            {formatSlotWithDayAndTime(groupSlot)}
          </p>
        </div>
      )}
      <div className="flex flex-col mt-6 w-full">
        <div className="flex gap-2 pl-4 place-items-center">
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
      <h2 className="md:hidden text-xl font-semibold ml-6 mt-6">Mes dates :</h2>
      <div className="flex flex-col items-center w-full flex-grow overflow-y-auto p-2 mb-20">
        {!isLoading && !isError && cahiersValides.length === 0 ? (
          <p className="text-center text-black">Aucune date trouvée</p>
        ) : (
          cahiersValides.map((workbook) => (
            <div
              key={workbook.id}
              onClick={() => handleWorkbookClick(workbook)}
              className="bg-white px-4 py-2 rounded-lg shadow-md mt-2 w-[90%] mb-2"
            >
              <div className="flex justify-between items-center w-full">
                <p className="px-3 py-1 text-sm font-semibold">
                  {displayDate(workbook.date)}
                </p>
                <StatusBadge
                  variant={workbook.validate ? "green" : "red"}
                  className="py-1"
                />
              </div>
            </div>
          ))
        )}
      </div>
      {selectedWorkbook && (
        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          size="lg"
          withCloseButton={false}
          radius="lg"
          centered
        >
          <CSeanceReadOnly
            abstract={selectedWorkbook.abstract}
            homework={selectedWorkbook.homework}
            abUrlList={selectedWorkbook.abUrlList}
            hwUrlList={selectedWorkbook.hwUrlList}
            groupName={groupName || undefined}
            groupSlot={groupSlot || undefined}
            date={selectedWorkbook.date}
            firstName={firstName || undefined}
          />
        </Modal>
      )}
      <BottomMenuStudent />
    </div>
  );
};

export default SeanceWeeksPage;
