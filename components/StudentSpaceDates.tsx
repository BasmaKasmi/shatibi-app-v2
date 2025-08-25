"use client";
import Image from "next/image";
import calendar from "@/public/calendar.svg";
import SelectDates from "@/public/select-dates.svg";
import Button from "./Button";
import { useQuery } from "@tanstack/react-query";
import { displayDate } from "@/lib/dates";
import clsx from "clsx";
import { QUERY_KEY } from "@/lib/queries";
import useStudentDates from "@/hooks/useStudentDates";
import {
  declareStudentAbsence,
  getStudentAttendanceDates,
  StudentAttendanceResponse,
} from "@/lib/student-api";
import { useEffect, useState } from "react";

interface CancelledAbsenceMotif {
  date: string;
  evidence: string;
}

interface ActiveAbsence {
  date: string;
  absent: string;
  evidence?: string;
}

interface StudentSpaceDatesProps {
  group_id: string;
  student_id: string;
  token: string;
  name: string;
  onClickCancel: () => void;
  onClickValidate: (
    activeAbsences: ActiveAbsence[],
    selectedDates: string[]
  ) => void;
  selectedDates: string[];
  selectedDatesFunctions: any;
  onCancelledAbsencesChange?: (motifs: CancelledAbsenceMotif[]) => void;
}

export const StudentSpaceDates = ({
  group_id,
  student_id,
  token,
  name,
  onClickCancel,
  onClickValidate,
  selectedDates,
  selectedDatesFunctions,
  onCancelledAbsencesChange,
}: StudentSpaceDatesProps) => {
  const {
    startDate,
    endDate,
    selectorDate,
    handleStartDateChange,
    handleEndDateChange,
  } = useStudentDates("student-dates-selection", 35);

  const [cancelledAbsences, setCancelledAbsences] = useState<string[]>([]);
  const [cancelledAbsenceMotifs, setCancelledAbsenceMotifs] = useState<
    CancelledAbsenceMotif[]
  >([]);
  const [originalMotif, setOriginalMotif] = useState<string>("");

  useEffect(() => {
    console.log("Dates sélectionnées:", { startDate, endDate, selectorDate });
  }, [startDate, endDate, selectorDate]);

  const {
    data: attendanceList,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<StudentAttendanceResponse, Error>({
    queryKey: [
      QUERY_KEY.STUDENT_ATTENDANCE,
      group_id,
      student_id,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getStudentAttendanceDates({
        group_id: Number(group_id),
        student_id: Number(student_id),
        token,
        start_date: startDate,
        end_date: endDate || undefined,
      }),
    enabled: !!group_id && !!token && !!startDate,
  });

  useEffect(() => {
    if (attendanceList?.result) {
      console.log("Données API reçues:", attendanceList.result);
    }
  }, [attendanceList]);

  const activeAbsences = attendanceList?.result
    ? attendanceList.result.filter(
        (item) => item.absent === "1" && !cancelledAbsences.includes(item.date)
      )
    : [];

  useEffect(() => {
    if (attendanceList?.result && attendanceList.result.length > 0) {
      const absenceWithEvidence = attendanceList.result.find(
        (item) => item.absent === "1" && item.evidence
      );

      if (absenceWithEvidence && absenceWithEvidence.evidence) {
        setOriginalMotif(absenceWithEvidence.evidence);
      }
    }
  }, [attendanceList]);

  const addOrRemoveDateToSelected = (
    date: string,
    isAbsent: boolean,
    isAnnulerClicked = false
  ) => {
    if (isAbsent && !isAnnulerClicked) {
      return;
    }

    if (selectedDates.includes(date)) {
      selectedDatesFunctions.removeAt(
        selectedDates.findIndex((d) => d === date)
      );
    } else {
      selectedDatesFunctions.push(date);
    }
  };

  const updateAttendanceStatus = async (
    date: string,
    newAbsentStatus: string
  ) => {
    try {
      await declareStudentAbsence({
        token,
        group_id: Number(group_id),
        student_id: Number(student_id),
        date_list: [
          {
            date,
            absence: newAbsentStatus === "1" ? "AI" : "PR",
            evidence: "",
          },
        ],
      });

      await refetch();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut d'absence", error);
    }
  };

  const handleAnnulerClick = async (
    event: React.MouseEvent<HTMLSpanElement>,
    date: string
  ) => {
    event.stopPropagation();

    const attendanceItem = attendanceList?.result.find(
      (item) => item.date === date
    );

    let motifEvidence = originalMotif;

    if (attendanceItem && attendanceItem.evidence) {
      motifEvidence = attendanceItem.evidence;
      if (!originalMotif) {
        setOriginalMotif(motifEvidence);
      }
    }

    const newMotif = {
      date,
      evidence: motifEvidence,
    };

    const newMotifs = [...cancelledAbsenceMotifs, newMotif];
    setCancelledAbsenceMotifs(newMotifs);

    if (onCancelledAbsencesChange) {
      onCancelledAbsencesChange(newMotifs);
    }

    setCancelledAbsences((prev) => [...prev, date]);

    if (selectedDates.includes(date)) {
      selectedDatesFunctions.removeAt(
        selectedDates.findIndex((d) => d === date)
      );
    }

    try {
      await updateAttendanceStatus(date, "0");

      await refetch();

      console.log("Absence annulée avec succès pour la date:", date);
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'absence", error);

      setCancelledAbsences((prev) => prev.filter((d) => d !== date));

      alert("Erreur lors de l'annulation de l'absence. Veuillez réessayer.");
    }
  };

  useEffect(() => {
    setCancelledAbsences([]);
  }, [attendanceList]);

  const filterDatesByRange = (
    attendanceData:
      | { date: string; absent: string; evidence?: string }[]
      | undefined
  ): { date: string; absent: string; evidence?: string }[] => {
    if (!attendanceData) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return attendanceData.filter((attendance) => {
      const attendanceDate = new Date(attendance.date);
      attendanceDate.setHours(0, 0, 0, 0);

      if (attendanceDate <= today) return false;

      if (!startDate) return true;

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && attendanceDate < start) return false;
      if (end && attendanceDate > end) return false;

      return true;
    });
  };

  const filteredDates = filterDatesByRange(attendanceList?.result);

  useEffect(() => {
    console.log("Dates filtrées à afficher:", filteredDates);
  }, [filteredDates]);

  if (isError && error instanceof Error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="relative p-2 justify-items-center flex flex-col items-center overflow-hidden">
      <h1 className="text-xl font-bold">Déclarer une absence</h1>
      <h2 className="text-center text-md font-semibold text-black mb-8">
        {name}
      </h2>
      <div className="mb-4 bg-white rounded-xl shadow w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 h-24 mx-auto">
        <div className="flex gap-2 pl-4 place-items-center">
          <Image className="mt-2" src={calendar} alt="User" />
          <label className="block text-sm font-semibold mt-2">
            Choisir dates :
          </label>
        </div>

        <div className="flex justify-center gap-4">
          <input
            type="date"
            className="w-2/5 p-2 border rounded-full mt-2 text-xs text-center"
            value={selectorDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
          <input
            type="date"
            className="w-2/5 p-2 px-2 border rounded-full mt-2 text-xs text-center"
            value={endDate}
            min={new Date().toISOString().split("T")[0]}
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
          ) : filteredDates.length > 0 ? (
            filteredDates.map((attendance) => {
              const isAbsent =
                attendance.absent === "1" &&
                !cancelledAbsences.includes(attendance.date);

              return (
                <div
                  key={attendance.date}
                  className={clsx(
                    "px-4 py-2 last:mb-0 shadow rounded-lg",
                    isAbsent
                      ? "bg-shatibi-red/[.15]"
                      : selectedDates.includes(attendance.date)
                      ? "bg-shatibi-red/[.15]"
                      : "bg-white",
                    isAbsent ? "cursor-not-allowed" : "cursor-pointer"
                  )}
                  onClick={() =>
                    addOrRemoveDateToSelected(attendance.date, isAbsent)
                  }
                >
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] font-semibold">
                      {displayDate(attendance.date)}
                    </p>
                    {isAbsent && (
                      <span
                        className="text-[13px] font-bold text-shatibi-red ml-4 cursor-pointer"
                        onClick={(e) => handleAnnulerClick(e, attendance.date)}
                      >
                        Annuler
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-center text-s font-medium">
                Aucun cours disponible dans la plage sélectionnée.
              </p>
            </div>
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
          onClick={() => {
            console.log({
              selectedDates,
              cancelledAbsenceMotifs,
              cancelledAbsences,
              originalMotif,
              activeAbsences,
            });

            if (
              selectedDates.length === 0 &&
              cancelledAbsenceMotifs.length === 0
            ) {
              alert(
                "Veuillez sélectionner au moins une date ou annuler une absence existante avant de continuer."
              );
            } else {
              onClickValidate(activeAbsences, selectedDates);
            }
          }}
        >
          Valider
        </Button>
      </div>
    </div>
  );
};
