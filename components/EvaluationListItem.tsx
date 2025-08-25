"use client";

import clsx from "clsx";
import { Student } from "./FeuilleEmargement";
import { Modal } from "@mantine/core";
import EvaluationObservation from "./EvaluationObservation";
import { displayDate } from "@/lib/dates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGroup from "@/hooks/useGroup";

import {
  postNextLevelStatus,
  NextLevelStatusPayload,
  NextLevelStatusResponse,
} from "@/api/index";
import { QUERY_KEY } from "@/lib/queries";
import { useTeacher } from "@/app/TeacherContext";
import { useState } from "react";

const CheckIcon = () => (
  <svg
    className="w-7 h-7 text-shatibi-green"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M5 13l4 4L19 7"></path>
  </svg>
);

const CrossIcon = () => (
  <svg
    className="w-7 h-7 text-shatibi-red"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

export type StatusButtonType = "Admis" | "Non admis" | "NA";

interface StatusButtonProps {
  status: StatusButtonType;
  active: boolean;
  onClick: (event: any) => void;
}

const StatusButton = ({ status, active, onClick }: StatusButtonProps) => {
  const isAdmis = status === "Admis";
  const buttonStyles = clsx(
    "rounded-full flex justify-center items-center text-center font-bold transition-all",
    {
      "h-8 w-28 bg-shatibi-green/[.15] text-shatibi-green": isAdmis && active,
      "h-8 w-28 bg-shatibi-red/[.15] text-shatibi-red": !isAdmis && active,
      "w-10 h-10 bg-shatibi-green/[.15] text-shatibi-green": isAdmis && !active,
      "w-10 h-10 bg-shatibi-red/[.15] text-shatibi-red": !isAdmis && !active,
    }
  );

  return (
    <button
      className={buttonStyles}
      onClick={(event) => {
        event.stopPropagation();
        onClick(event);
      }}
    >
      {active ? (
        isAdmis ? (
          "Admis"
        ) : (
          status
        )
      ) : isAdmis ? (
        <CheckIcon />
      ) : (
        <CrossIcon />
      )}
    </button>
  );
};

const abandoned = (abort: string | null | undefined): boolean => {
  return abort !== null && abort !== undefined && abort !== "0";
};

const EvaluationListItem = ({
  student,
  groupId,
}: {
  groupId: number;
  student: Student;
}) => {
  const [opened, setOpened] = useState(false);

  const close = () => setOpened(false);
  const open = () => setOpened(true);

  const queryClient = useQueryClient();

  const { getStudentStatistics } = useGroup({
    date: "",
    groupId,
  });

  const { teacherId } = useTeacher();

  const convertLegacyStatus = (status: string): StatusButtonType => {
    if (status === "Non admis") return "Non admis";
    if (status === "Admis" || status === "NA")
      return status as StatusButtonType;
    return status as StatusButtonType;
  };

  const currentStatus = convertLegacyStatus(student.next_level as string);
  const isActiveNonAdmis = currentStatus === "Non admis";
  const isActiveAdmis = currentStatus === "Admis";

  const isAbandoned = abandoned(student.abort);

  const updateNextLevelStatus = useMutation<
    NextLevelStatusResponse,
    Error,
    NextLevelStatusPayload
  >({
    mutationFn: postNextLevelStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NEXT_LEVEL_STATUS, groupId, student.id],
      });
    },
  });

  const handleNextLevelChange = async (
    studentId: number,
    newStatus: StatusButtonType,
    appreciation?: string
  ) => {
    const apiValue = newStatus === "Non admis" ? "Non admis" : newStatus;

    updateNextLevelStatus.mutate(
      {
        group_id: groupId,
        student_id: studentId,
        next_level: apiValue,
        appreciation: appreciation || "NA",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.GROUP_STUDENTS],
          });
        },
      }
    );
  };

  const hasValidAppreciation = (
    appreciation: string | null | undefined
  ): boolean => {
    return (
      appreciation !== null &&
      appreciation !== undefined &&
      appreciation !== "NA" &&
      appreciation !== ""
    );
  };

  return (
    <div
      onClick={open}
      key={student.id}
      className={clsx(
        "flex justify-between items-center shadow-md rounded-2xl p-3",
        isAbandoned ? "bg-gray-500/25" : "bg-white"
      )}
    >
      <Modal
        onClose={close}
        opened={opened}
        withCloseButton={false}
        radius="lg"
        centered
      >
        <EvaluationObservation
          onCancel={close}
          groupId={groupId}
          nextLevel={currentStatus}
          studentId={student.id}
          initialAppreciation={student.appreciation}
        />
      </Modal>

      <div className="flex items-center">
        <div className="pl-3">
          <p className="text-[14px] font-semibold">
            {student.name}
            {hasValidAppreciation(student.appreciation) && (
              <span className="ml-1">*</span>
            )}
          </p>
          {isAbandoned ? (
            <p className="text-xs font-normal">
              Abandon depuis{" "}
              <span className="text-black font-semibold">
                {displayDate(student.abort!)}
              </span>
            </p>
          ) : (
            <p className="text-xs font-normal">
              Absences: {getStudentStatistics(student.id).totalAbsences}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {!isAbandoned && (
          <>
            {isActiveNonAdmis ? (
              <StatusButton
                status="Non admis"
                active={true}
                onClick={() => handleNextLevelChange(student.id, "NA")}
              />
            ) : isActiveAdmis ? (
              <StatusButton
                status="Admis"
                active={true}
                onClick={() => handleNextLevelChange(student.id, "NA")}
              />
            ) : (
              <>
                <StatusButton
                  status="Admis"
                  active={false}
                  onClick={() => handleNextLevelChange(student.id, "Admis")}
                />
                <StatusButton
                  status="Non admis"
                  active={false}
                  onClick={() => handleNextLevelChange(student.id, "Non admis")}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EvaluationListItem;
