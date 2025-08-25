"use client";

import { useGroup } from "@/hooks/useGroup";
import Button from "./Button";
import evidenceIcon from "@/public/assets/evidence.svg";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import ValiderEmargementModal from "./ValiderEmargement";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { StudentModalContentWrapper } from "@/app/emargement/components";
import {
  DeclareAbsencePayload,
  ValidateEmargementPayload,
  declareAp,
  fetchLastPresence,
  validateFeuilleEmargement,
} from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useTeacher } from "@/app/TeacherContext";
import { displayDate } from "@/lib/dates";
import DropdownMenu from "@/components/DropdownMenu";
import { EvidenceData } from "@/utils/types";
import EvidenceModal from "./EvidenceModal";

export type Student = {
  id: number;
  name: string;
  absent: boolean;
  motive: string;
  abort: string;
  next_level?: string;
  appreciation?: string;
  date?: string;
  isAPFromDropdown?: boolean;
  hour?: string;
  evidence?: string;
};

type Props = {
  groupId: number;
  date: string;
  groupName: string;
  groupSlot: string;
};

interface StudentAbsence {
  id: number;
  absent: boolean;
  motive: "AP" | "AI" | "PR" | "RJ" | "AE" | "";
}
interface QueryData {
  result: StudentAbsence[];
}
type LastPresenceResult = "0" | string;

type LastPresencesState = {
  [studentId: number]: LastPresenceResult | undefined;
};

const AI_AP_CLASSNAMES =
  "shadow-lg rounded-full text-shatibi-red flex place-items-center text-center font-bold";

const BUTTON_STYLES = {
  BASE: "h-10 text-sm flex items-center justify-center whitespace-nowrap",
  SIMPLE: "w-32",
  WITH_ICON: "w-24",
  ICON_ONLY: "w-10",
};

interface ApOrAiButtonProps {
  apOrAi: "AP" | "AI" | "PR" | "RJ" | "AE";
  active: boolean;
  motive: string;
  isAPFromDropdown?: boolean;
  onClick: (event: any) => void;
  className?: string;
  name?: string;
  date?: string;
  hour?: string;
  evidence?: string;
  onEvidenceClick?: (data: {
    studentName: string;
    date: string;
    hour: string;
    evidence: string;
  }) => void;
}

const ApOrAiButton = ({
  apOrAi,
  active,
  motive,
  onClick,
  className = "",
  name,
  date,
  hour,
  evidence,
  isAPFromDropdown,
  onEvidenceClick,
}: ApOrAiButtonProps) => {
  const displayText =
    motive === "AP"
      ? "Abs. prévue"
      : motive === "AI"
      ? "Absent"
      : motive === "RJ"
      ? "En retard"
      : motive === "AE"
      ? "Exclusion"
      : motive === "PR" || motive === ""
      ? "Présent"
      : "AI";

  const handleClick = (event: any) => {
    event.stopPropagation();

    if (
      displayText === "En retard" ||
      displayText === "Abs. prévue" ||
      displayText === "Exclusion"
    ) {
      onClick("PR");
      return;
    }

    if (displayText === "Absent") {
      onClick("AI");
    } else if (displayText === "AI") {
      onClick("Absent");
    } else if (displayText === "Présent") {
      onClick("Absent");
    }
  };

  return (
    <div className="flex items-center">
      <div
        className={clsx(
          BUTTON_STYLES.BASE,
          AI_AP_CLASSNAMES,
          {
            [BUTTON_STYLES.SIMPLE]:
              motive === "RJ" ||
              motive === "AE" ||
              motive === "AP" ||
              motive === "AI",
            "!bg-shatibi-orange/[.15] !text-shatibi-orange mr-2":
              motive === "RJ",
            "!bg-gray-200 !text-gray-700 mr-2": motive === "AE",
            "bg-shatibi-red text-white": active,
            "bg-shatibi-red/[.15]": !active,
            "-translate-x-2":
              displayText === "Absent" || displayText === "Abs. prévue",
          },
          {
            [`${BUTTON_STYLES.WITH_ICON} !bg-shatibi-green/[.15] !text-shatibi-green`]:
              displayText === "Présent" && (motive === "PR" || motive === ""),
            [`${BUTTON_STYLES.WITH_ICON} bg-shatibi-red text-white`]: false,
            [BUTTON_STYLES.ICON_ONLY]: !motive || (!active && apOrAi === "AI"),
          },
          className
        )}
        onClick={handleClick}
      >
        <p className="text-center">{displayText}</p>
      </div>
      {motive === "AP" && evidence && evidence.trim() !== "" && (
        <div
          className="flex items-center justify-center rounded-lg mr-2"
          onClick={(e) => {
            e.stopPropagation();
            onEvidenceClick?.({
              studentName: name || "",
              date: date || "",
              hour: hour || "",
              evidence: evidence || "",
            });
          }}
        >
          <Image src={evidenceIcon} alt="evidence" width={20} height={20} />
        </div>
      )}
    </div>
  );
};

export const useLastPresence = (teacherId: number | null, groupId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAST_PRESENCE, teacherId, groupId],
    queryFn: () => {
      if (!teacherId) throw new Error("Teacher ID is required");
      return fetchLastPresence(teacherId, groupId);
    },
    enabled: !!teacherId,
  });
};

const FeuilleEmargement = ({ groupId, date }: Props) => {
  const {
    studentsForDate,
    isLoadingForDate,
    getTotalAbsences,
    statistics,
    getStudentStatistics,
  } = useGroup({
    groupId,
    date,
  });

  const [absentStudents, setAbsentStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<null | number>(
    null
  );
  const [apFromDropdownIds, setApFromDropdownIds] = useState<Set<number>>(
    new Set()
  );
  const [lastPresences, setLastPresences] = useState<LastPresencesState>({});
  const { teacherId, setTeacherId } = useTeacher();
  const [evidenceData, setEvidenceData] = useState<EvidenceData | null>(null);
  const [evidenceOpened, { open: openEvidence, close: closeEvidence }] =
    useDisclosure(false);
  const { data: lastPresenceData } = useLastPresence(teacherId, groupId);

  const handleRemoveAbsence = (studentId: number) => {
    // setLastPresences((prevState) => ({
    //   ...prevState,
    //   [studentId]: "0",
    // }));

    mutate({ studentId, apOrAi: "PR" });
  };

  const queryClient = useQueryClient();

  const [opened, { open, close }] = useDisclosure(false);

  const { mutate } = useMutation({
    mutationFn: ({
      studentId,
      apOrAi,
      isFromDropdown = false,
    }: {
      studentId: number;
      apOrAi: "AP" | "AI" | "PR" | "RJ" | "AE";
      isFromDropdown?: boolean;
    }) => {
      const payload: DeclareAbsencePayload = {
        group_id: groupId,
        date: date,
        student_id: studentId,
        absence: apOrAi,
      };

      queryClient.setQueryData<QueryData>(
        [QUERY_KEY.GROUP_STUDENTS, groupId, date],
        (oldData) => {
          if (!oldData) {
            return { result: [] };
          }
          const newResult = oldData.result.map((data: any) => {
            if (data.id === studentId) {
              return {
                ...data,
                absent: apOrAi !== "PR",
                motive: apOrAi !== "PR" ? apOrAi : "",
                isAPFromDropdown: apOrAi === "AP" ? isFromDropdown : false,
              };
            }
            return data;
          });

          return { ...oldData, result: newResult };
        }
      );

      return declareAp(payload);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GROUP_STUDENTS] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GROUP_STUDENTS] });
    },
    onError: (error) => {
      console.error("Une erreur est survenue lors de la mutation : ", error);
    },
  });

  const { mutate: validateFeuille } = useMutation({
    mutationFn: () => {
      if (teacherId === null) {
        throw new Error("L'ID de l'enseignant n'est pas disponible.");
      }
      const payload: ValidateEmargementPayload = {
        teacher_id: teacherId,
        group_id: groupId,
        date: date,
        student_list: studentsForDate.map((student) => ({
          student_id: student.id,
          absence: (student.motive || "PR") as "PR" | "AP" | "AI" | "RJ" | "AE",
        })),
      };

      return validateFeuilleEmargement(payload);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.EMARGEMENT_NON_FAIT],
      });

      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GROUP_STUDENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LAST_PRESENCE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NEXT_COURSE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ATTENDANCE_LIST] });
    },
  });

  const handleClickValiderEmargement = () => {
    setAbsentStudents(
      studentsForDate.filter((student: Student) => student.absent)
    );

    open();
  };

  const onValidate = () => {
    validateFeuille();

    close();
  };

  const onCancel = () => {
    close();
  };

  if (isLoadingForDate) return <p className="p-3">Chargement...</p>;

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden md:hidden">
      <Modal
        withCloseButton={false}
        radius="lg"
        onClose={() => setSelectedStudentId(null)}
        opened={selectedStudentId !== null}
        centered
      >
        {selectedStudentId ? (
          <StudentModalContentWrapper
            studentStats={getStudentStatistics(selectedStudentId)}
            onClickCancel={() => setSelectedStudentId(null)}
            group_id={groupId}
            student_id={selectedStudentId}
          />
        ) : null}
      </Modal>

      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        radius="lg"
        centered
      >
        <ValiderEmargementModal
          onValidate={onValidate}
          onCancel={onCancel}
          students={studentsForDate}
          Absentstudents={absentStudents}
        />
      </Modal>

      <Modal
        opened={evidenceOpened}
        onClose={closeEvidence}
        withCloseButton={false}
        radius="lg"
        centered
      >
        <EvidenceModal data={evidenceData} />
      </Modal>

      <div className="flex flex-col gap-2 p-5 min-h-[33%] max-h-[83%] grow overflow-y-auto">
        {[...studentsForDate]
          .sort((a, b) => {
            if (a.abort && a.abort !== "0" && (!b.abort || b.abort === "0"))
              return 1;
            if (b.abort && b.abort !== "0" && (!a.abort || a.abort === "0"))
              return -1;
            return 0;
          })
          .map((student: Student) => {
            const {
              name,
              id,
              absent,
              motive,
              abort,
              evidence,
              hour,
              date: studentDate,
            } = student;
            const isAPFromDropdown = student.isAPFromDropdown || false;
            const isAbandoned = abort && abort !== "0";

            const isInApOrAiOrRj =
              motive === "AP" || motive === "AI" || motive === "RJ";

            return (
              <div
                onClick={() => !isAbandoned && setSelectedStudentId(id)}
                key={id}
                className={clsx(
                  "flex flex-row shadow-md rounded-2xl justify-between",
                  isAbandoned
                    ? "bg-gray-200"
                    : isInApOrAiOrRj && motive !== "RJ"
                    ? "bg-shatibi-red/[.15]"
                    : "bg-white"
                )}
              >
                <div className="flex items-center">
                  {isAbandoned ? (
                    <div className="rounded-l-2xl h-full flex items-center justify-center bg-gray-300">
                      <p className="text-transparent text-center text-md font-semibold px-2">
                        abd
                      </p>
                    </div>
                  ) : (
                    <div
                      className={clsx(
                        "rounded-l-2xl h-full flex items-center justify-center",
                        isAbandoned ? "bg-gray-300" : "bg-shatibi-orange"
                      )}
                    >
                      <p className="text-white text-center text-md font-semibold px-2">
                        {getTotalAbsences(id)}
                        <br />
                        Abs
                      </p>
                    </div>
                  )}

                  <div className="pl-3">
                    <p className="text-[0.75rem] font-semibold">
                      {isAbandoned
                        ? name
                        : name.length > 18
                        ? `${name.slice(0, 18)}...`
                        : name}
                    </p>
                    <p className="text-xs font-normal">
                      {isAbandoned ? (
                        <>
                          Abandon depuis&nbsp;
                          <span className="text-black font-semibold">
                            {displayDate(abort)}
                          </span>
                        </>
                      ) : (
                        (() => {
                          const absences = lastPresenceData?.result.find(
                            (s) => s.student_id === id
                          )?.absences;

                          if (absences === 0) return "";
                          if (absences === 1)
                            return "Abs. à la dernière séance";
                          if (absences && absences > 1) {
                            return (
                              <>
                                Abs. depuis
                                <span className="text-black font-semibold">
                                  {` ${absences} séances`}
                                </span>
                              </>
                            );
                          }
                          return null;
                        })()
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex p-3 pr-0">
                  {!isAbandoned &&
                    (absent ? (
                      <>
                        {motive === "AP" ? (
                          <ApOrAiButton
                            apOrAi="AP"
                            active
                            motive={motive}
                            name={name}
                            date={student.date || ""}
                            hour={hour}
                            evidence={evidence}
                            onClick={() => handleRemoveAbsence(id)}
                            onEvidenceClick={(data) => {
                              setEvidenceData(data);
                              openEvidence();
                            }}
                            isAPFromDropdown={
                              isAPFromDropdown || apFromDropdownIds.has(id)
                            }
                          />
                        ) : null}
                        {motive === "AI" ? (
                          <ApOrAiButton
                            apOrAi="AI"
                            active
                            motive={motive}
                            onClick={() => handleRemoveAbsence(id)}
                          />
                        ) : null}
                        {motive === "PR" ? (
                          <ApOrAiButton
                            apOrAi="PR"
                            active
                            motive={motive}
                            onClick={() => handleRemoveAbsence(id)}
                          />
                        ) : null}
                        {motive === "RJ" ? (
                          <ApOrAiButton
                            apOrAi="RJ"
                            active
                            motive={motive}
                            onClick={() => handleRemoveAbsence(id)}
                          />
                        ) : null}
                        {motive === "AE" ? (
                          <ApOrAiButton
                            apOrAi="AE"
                            active
                            motive={motive}
                            onClick={() => handleRemoveAbsence(id)}
                          />
                        ) : null}
                      </>
                    ) : (
                      <div className="flex flex-row gap-2">
                        {/*<ApOrAiButton
          apOrAi="AP"
          active={false}
          motive={motive}
          onClick={() => mutate({ studentId: id, apOrAi: "AP" })}
        />*/}
                        <ApOrAiButton
                          apOrAi="AI"
                          active={false}
                          motive={motive}
                          onClick={() =>
                            mutate({ studentId: id, apOrAi: "AI" })
                          }
                        />
                      </div>
                    ))}
                  {isAbandoned && (
                    <div className="flex flex-row gap-2">
                      {/*<ApOrAiButton
        apOrAi="AP"
        active={false}
        motive={motive}
        onClick={() => {}}
        className="opacity-0"
      />*/}
                      <ApOrAiButton
                        apOrAi="AI"
                        active={false}
                        motive={motive}
                        onClick={() => {}}
                        className="opacity-0"
                      />
                    </div>
                  )}
                  {(motive === "PR" || motive === "") && !isAbandoned && (
                    <div className={clsx("ml-1")}>
                      <DropdownMenu
                        className={BUTTON_STYLES.WITH_ICON}
                        studentId={id}
                        groupId={groupId}
                        date={date}
                        onAbsenceChange={(type) => {
                          console.log("Absence déclarée:", type);

                          if (type === "AP") {
                            setApFromDropdownIds((prev) => {
                              const newSet = new Set(prev);
                              newSet.add(id);
                              return newSet;
                            });
                          }

                          mutate({
                            studentId: id,
                            apOrAi: type,
                            isFromDropdown: true,
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <div className="w-full bg-white py-3">
        <Button
          className="mx-auto block font-bold"
          onClick={() => handleClickValiderEmargement()}
          variant="green"
        >
          Valider la feuille d&apos;émargement
        </Button>
      </div>
    </div>
  );
};

export default FeuilleEmargement;
