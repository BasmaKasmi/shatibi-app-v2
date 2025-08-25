"use client";
import useGroup from "@/hooks/useGroup";
import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { Modal } from "@mantine/core";
import {
  ValidatePassageResponse,
  ValidatePassagePayload,
  validatePassageApi,
} from "@/api/index";
import Button from "./Button";
import { useSearchParams } from "next/navigation";
import { QUERY_KEY } from "@/lib/queries";
import PassageReviewConfirmation from "./PassageReviewConfirmation";
import { AxiosError } from "axios";
import { useTeacher } from "@/app/TeacherContext";
import { Student } from "./FeuilleEmargement";
import EvaluationListItem from "./EvaluationListItem";
import { useLocalStorage } from "react-use";

const LOCAL_STORAGE_VALIDATED_GROUPS_KEY = "validatedGroups";

const EvaluationList = () => {
  const search = useSearchParams();
  const groupId = Number(search.get("groupId"));
  const studentId = Number(search.get("studentId"));

  const [isPassageReviewConfirmationOpen, setIsPassageReviewConfirmationOpen] =
    useState(false);

  const [validatedGroupsStored, setValue] = useLocalStorage<any>(
    LOCAL_STORAGE_VALIDATED_GROUPS_KEY
  );

  const { teacherId } = useTeacher();

  const openPassageReviewConfirmation = () => {
    setIsPassageReviewConfirmationOpen(true);
  };

  const closePassageReviewConfirmation = () => {
    setIsPassageReviewConfirmationOpen(false);
  };

  const useValidatePassage = (
    groupId: number,
    studentId: number
  ): UseMutationResult<
    ValidatePassageResponse,
    AxiosError,
    ValidatePassagePayload
  > => {
    const queryClient = useQueryClient();

    return useMutation<
      ValidatePassageResponse,
      AxiosError,
      ValidatePassagePayload
    >({
      mutationFn: validatePassageApi,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.GROUPS, groupId],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.NEXT_LEVEL_STATUS, studentId],
        });
      },
      onError: (error) => {
        console.error("Error in validating passage: ", error.message);
      },
    });
  };
  const validatePassage = useValidatePassage(groupId, studentId);

  const handleConfirmValidation = () => {
    if (teacherId == null) {
      console.error("Teacher ID is not set");
      return;
    }
    openPassageReviewConfirmation();

    const isRealized = true;
    const levelValid = isRealized ? "1" : "0";

    validatePassage.mutate(
      {
        teacher_id: teacherId,
        group_id: groupId,
        level_valid: levelValid,
      },
      {
        onSuccess: () => {
          console.log("Avis de passage validé avec succès.");
          updateValidatedGroupsStorage();
          closePassageReviewConfirmation();
        },
        onError: (error) => {
          console.error("Erreur lors de la validation:", error);
        },
      }
    );
  };

  const updateValidatedGroupsStorage = () => {
    const validatedGroups = validatedGroupsStored;
    if (!validatedGroups.includes(groupId)) {
      validatedGroups.push(groupId);
      setValue(JSON.stringify(validatedGroups));
    }
  };

  const { allStudents } = useGroup({
    date: "",
    groupId,
  });

  const hasAbandoned = (student: Student): boolean => {
    return (
      student.abort !== null &&
      student.abort !== undefined &&
      student.abort !== "0"
    );
  };

  const sortedStudents = [...allStudents].sort((a, b) => {
    const aAbandoned = hasAbandoned(a);
    const bAbandoned = hasAbandoned(b);

    if (aAbandoned && !bAbandoned) return 1;
    if (!aAbandoned && bAbandoned) return -1;
    return 0;
  });

  if (!groupId) return <p>Veuillez spécifier un groupe et une date</p>;

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden md:hidden">
      <div className="flex flex-col gap-2 p-5 min-h-[33%] max-h-[83%] grow overflow-y-auto">
        {sortedStudents.map((student: Student) => (
          <EvaluationListItem
            groupId={groupId}
            student={student}
            key={student.id}
          />
        ))}
      </div>

      <div className="w-full bg-white py-3">
        <Button
          className="mx-auto w-72 h-11 block font-bold"
          variant="green"
          onClick={openPassageReviewConfirmation}
        >
          Valider l&apos;avis de passage
        </Button>
      </div>

      <Modal
        opened={isPassageReviewConfirmationOpen}
        onClose={closePassageReviewConfirmation}
        withCloseButton={false}
        radius="lg"
        centered
      >
        <PassageReviewConfirmation
          onValidate={handleConfirmValidation}
          onCancel={closePassageReviewConfirmation}
        />
      </Modal>
    </div>
  );
};
export default EvaluationList;
