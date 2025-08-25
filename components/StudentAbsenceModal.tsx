"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@mantine/core";
import { Group, getStudentsGroups } from "@/lib/student-api";
import { QUERY_KEY } from "@/lib/queries";
import { formatDayToThreeLetters } from "@/lib/dates";

interface StudentAbsenceProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number | null;
  token: string | null;
  onGroupSelect: (group: { id: number; name: string }) => void;
}

function StudentAbsenceModal({
  isOpen,
  onClose,
  studentId,
  token,
  onGroupSelect,
}: StudentAbsenceProps): JSX.Element | null {
  const {
    data: groupsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QUERY_KEY.STUDENTS_GROUPS, studentId],
    queryFn: async () => {
      if (!studentId || !token) {
        throw new Error("L'ID étudiant et le token sont requis");
      }
      const response = await getStudentsGroups(studentId, token);
      return response;
    },
    enabled: !!studentId && !!token,
  });

  const groups = groupsData?.result?.group_list || [];

  const handleGroupSelection = (group: Group): void => {
    onGroupSelect({
      id: group.id,
      name: group.name,
    });
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      radius="lg"
      centered
      withCloseButton={false}
      styles={{
        body: {
          padding: "1.5rem",
        },
        content: {
          borderRadius: "1.5rem",
        },
      }}
    >
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">Déclarer une absence</h1>
        <h2 className="text-md">Choisir un groupe</h2>
      </div>

      <div className="flex-1">
        {isLoading && <div className="text-center py-4">Chargement...</div>}

        {isError && error instanceof Error && (
          <div className="text-center text-red-500 py-4">
            Erreur : {error.message}
          </div>
        )}

        <div className="flex flex-col items-center justify-center mt-2 min-h-[33%] max-h-[60%] overflow-y-auto">
          {groups.map((group) => (
            <button
              key={group.id}
              className="px-4 py-2 bg-white shadow-md rounded-lg w-[95%] mb-2 text-left"
              onClick={() => handleGroupSelection(group)}
            >
              <p className="font-semibold">
                {group.name || "Nom du groupe indisponible"}
              </p>
              <p className="text-xs font-light">
                {formatDayToThreeLetters(group.slot)}
              </p>
            </button>
          ))}
        </div>

        {!isLoading && !isError && groups.length === 0 && (
          <div className="text-center py-4">Aucun groupe à afficher</div>
        )}
      </div>
    </Modal>
  );
}

export default StudentAbsenceModal;
