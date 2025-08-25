"use client";
import Image from "next/image";
import React from "react";
import calendar from "@/public/calendar.svg";
import SelectDates from "@/public/select-dates.svg";
import Button from "./Button";
import { useQuery } from "@tanstack/react-query";
import { displayDate } from "@/lib/dates";
import clsx from "clsx";
import { getWorkbookList } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import useSelectedDates from "@/hooks/useSelectedDates";
import { useTeacher } from "@/app/TeacherContext";

interface WorkbookItem {
  id: number;
  date: string;
}

export const CdsDates = ({
  group_id,
  name,
  onClickCancel,
  onClickValidate,
  selectedDates,
  selectedDatesFunctions,
  onWorkbookDataChange,
}: {
  group_id: string;
  student_id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  onClickCancel: () => void;
  onClickValidate: () => void;
  selectedDates: string[];
  selectedDatesFunctions: any;
  onWorkbookDataChange?: (workbookData: WorkbookItem[]) => void;
}) => {
  const { teacherId } = useTeacher();

  const {
    startDate,
    endDate,
    selectorDate,
    handleStartDateChange,
    handleEndDateChange,
  } = useSelectedDates("student-dates-selection");

  const {
    data: workbookResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      QUERY_KEY.WORKBOOK_LIST,
      group_id,
      teacherId,
      startDate,
      endDate,
    ],
    queryFn: () => {
      if (!teacherId || !startDate || !endDate) {
        throw new Error("Missing required parameters");
      }
      return getWorkbookList(Number(group_id), teacherId, startDate, endDate);
    },
    enabled: !!group_id && !!teacherId && !!startDate && !!endDate,
  });

  const workbookList: WorkbookItem[] = workbookResponse?.result || [];

  React.useEffect(() => {
    if (workbookList.length > 0 && onWorkbookDataChange) {
      onWorkbookDataChange(workbookList);
    }
  }, [workbookList, onWorkbookDataChange]);

  const getWorkbookIdForDate = (date: string): number | null => {
    const workbook = workbookList.find((wb) => wb.date === date);
    return workbook?.id || null;
  };

  const addOrRemoveDateToSelected = (date: string) => {
    const workbookId = getWorkbookIdForDate(date);

    if (selectedDates.includes(date)) {
      selectedDatesFunctions.removeAt(
        selectedDates.findIndex((d) => d === date)
      );
    } else {
      selectedDatesFunctions.push(date, workbookId);
    }
  };

  if (isError) {
    return <div>{error?.message || "Une erreur est survenue"}</div>;
  }

  return (
    <div className="relative p-2 justify-items-center flex flex-col items-center overflow-hidden">
      <h2 className="text-center text-lg font-semibold text-black mb-8">
        {name}
      </h2>
      <div className="mb-4 bg-white rounded-xl shadow w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 h-24 mx-auto">
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
            className="w-2/5 p-2 border rounded-full mt-2 text-xs text-center"
            value={selectorDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
          <input
            id="end_date"
            type="date"
            className="w-2/5 p-2 px-2 border rounded-full mt-2 text-xs text-center"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 bg-white rounded-xl shadow w-full h-64 sm:h-64 md:h-96 lg:h-80 xl:h-96">
        <div className="flex gap-2 pl-4 place-items-center text-sm font-semibold mt-3">
          <Image src={SelectDates} alt="User" />
          Sélectionner les dates :
        </div>
        <div className="flex flex-col gap-2 p-5 max-h-[78%] overflow-scroll">
          {isLoading ? (
            <p>Chargement...</p>
          ) : (
            workbookList?.map((workbook) => (
              <div
                key={workbook.date}
                className={clsx(
                  "p-2 last:mb-0 shadow rounded-lg cursor-pointer",
                  selectedDates.includes(workbook.date)
                    ? "bg-shatibi-red/[.15]"
                    : "bg-white"
                )}
                onClick={() => addOrRemoveDateToSelected(workbook.date)}
              >
                <p className="text-[14px] font-semibold">
                  {displayDate(workbook.date)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-center gap-6 w-full mt-4">
        <Button
          className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 px-8 rounded-full"
          variant="red"
          onClick={onClickCancel}
        >
          Retour
        </Button>
        <Button
          className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
          variant="green"
          onClick={onClickValidate}
        >
          Valider
        </Button>
      </div>
    </div>
  );
};
