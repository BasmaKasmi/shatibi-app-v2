"use client";

import Image from "next/image";
import calendar from "@/public/calendar.svg";
// import edit from "@/public/assets/edit-cds.svg";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { displayDate, formatSlotWithDayAndTime } from "@/lib/dates";
import { getWorkbookList, Workbook, WorkbookListApiResponse } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useTeacher } from "@/app/TeacherContext";
import BottomMenu from "@/components/BottomMenu";
import useSelectedDates from "@/hooks/useSelectedDates";
import StatusBadge from "@/components/StatusBadge";
import { useRouter } from "next/navigation";
import CSeanceInfoModal from "@/components/CSeanceInfoModal";
import HeaderWithPlus from "@/components/HeaderWithPlus";

const WeeksPage = () => {
  const search = useSearchParams();
  const groupId = Number(search.get("groupId"));
  const groupName = search.get("groupName");
  const router = useRouter();
  const groupSlot = search.get("groupSlot");

  const [workbookStatuses, setWorkbookStatuses] = useState<{
    [id: number]: boolean;
  }>({});
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedWorkbookForInfo, setSelectedWorkbookForInfo] =
    useState<Workbook | null>(null);

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

  // Fonction supprimée car plus utilisée
  // const handleWorkbookClick = (workbook: Workbook) => {
  //   setSelectedWorkbook(workbook);
  //   setModalOpen(true);
  // };
  const handleDateClick = (workbook: Workbook) => {
    setSelectedWorkbookForInfo(workbook);
    setInfoModalOpen(true);
  };

  const handleNavigateToDevoir = (workbook: Workbook) => {
    localStorage.setItem("selectedWorkbookDate", workbook.date);

    router.push(
      `devoir-collectif?groupId=${groupId}&groupName=${encodeURIComponent(
        groupName || ""
      )}&groupSlot=${encodeURIComponent(groupSlot || "")}&workbookId=${
        workbook.workbook_id
      }&date=${encodeURIComponent(
        workbook.date
      )}&fromWeeksPage=true&defaultTab=devoir`
    );
  };

  const getWorkbookStatus = (workbook: Workbook): boolean => {
    return workbookStatuses[workbook.id] !== undefined
      ? workbookStatuses[workbook.id]
      : workbook.validate;
  };

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden md:hidden">
      <div className="px-5 py-4">
        <HeaderWithPlus title="Cahier de séance" />
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
              className="bg-white px-4 py-2 rounded-lg shadow-md mt-2 w-[90%] mb-2"
            >
              <div className="flex justify-between items-center w-full">
                <p
                  className="px-3 py-1 text-sm font-semibold"
                  onClick={() => handleDateClick(workbook)}
                >
                  {displayDate(workbook.date)}
                </p>
                <div className="flex items-center gap-2">
                  <div>
                    <StatusBadge
                      className="py-1 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleNavigateToDevoir(workbook)}
                      ratio={workbook.ratio}
                      homework={workbook.homework}
                      showRatio={true}
                    />
                  </div>
                  {/*   <Image
                    src={edit}
                    alt="Modifier"
                    width={16}
                    height={16}
                    onClick={() => handleWorkbookClick(workbook)}
                    className="cursor-pointer"
                  />*/}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        withCloseButton={false}
        radius="lg"
        centered
      >
        {selectedWorkbook && (
          <ClassWork
            name={groupName || ""}
            groupId={groupId}
            teacherId={teacherId || 0}
            studentId={0}
            date={selectedWorkbook.date}
            workbookId={selectedWorkbook.id}
            onComplete={() => {
              updateWorkbookStatus(selectedWorkbook.id, true);
              setModalOpen(false);
            }}
            defaultTab={mode || "resume"}
          />
        )}
      </Modal>*/}

      {selectedWorkbookForInfo && (
        <CSeanceInfoModal
          workbookId={selectedWorkbookForInfo.workbook_id}
          date={selectedWorkbookForInfo.date}
          groupId={groupId}
          teacherId={teacherId || 0}
          groupName={groupName || ""}
          isOpen={infoModalOpen}
          onClose={() => {
            setInfoModalOpen(false);
            setSelectedWorkbookForInfo(null);
          }}
          viewType="Devoir collectif"
          modalTitle="Devoir collectif"
        />
      )}

      <BottomMenu />
    </div>
  );
};

export default WeeksPage;
