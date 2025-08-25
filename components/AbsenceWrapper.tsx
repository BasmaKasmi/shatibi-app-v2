"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@mantine/core";
import { Group, getStudentsGroups } from "@/lib/student-api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/queries";
import { formatDayToThreeLetters } from "@/lib/dates";
import { useList } from "react-use";
import { StudentSpaceDates } from "./StudentSpaceDates";
import DeclareStudentAp from "./DeclareStudentAp";
import { StudentProvider, useStudent } from "@/app/StudentContext";
import { useRouter } from "next/navigation";
import AbsenceConfirmation from "./AbsenceConfirmation";

interface AbsenceWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number | null;
  token: string | null;
}
interface ActiveAbsence {
  date: string;
  absent: string;
  evidence?: string;
}

interface CancelledAbsenceMotif {
  date: string;
  evidence: string;
}

function AbsenceWrapper({
  isOpen,
  onClose,
  studentId,
  token,
}: AbsenceWrapperProps) {
  if (!isOpen) return null;

  return (
    <StudentProvider>
      <AbsenceWrapperContent
        isOpen={isOpen}
        onClose={onClose}
        studentId={studentId}
        token={token}
      />
    </StudentProvider>
  );
}

function AbsenceWrapperContent({
  isOpen,
  onClose,
  studentId,
  token,
}: AbsenceWrapperProps) {
  const { setStudentData } = useStudent();
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedDates, selectedDatesFunctions] = useList<string>([]);
  const [showGroupModal, setShowGroupModal] = useState(true);
  const [showDeclarationModal, setShowDeclarationModal] = useState(false);
  const [evidence, setEvidence] = useState("");
  const [originalEvidence, setOriginalEvidence] = useState("");
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [cancelledAbsenceMotifs, setCancelledAbsenceMotifs] = useState<
    CancelledAbsenceMotif[]
  >([]);
  const [activeAbsences, setActiveAbsences] = useState<ActiveAbsence[]>([]);
  const [currentDatesForDeclaration, setCurrentDatesForDeclaration] = useState<
    string[]
  >([]);

  const handleCancelledAbsencesChange = (motifs: CancelledAbsenceMotif[]) => {
    console.log("Motifs reçus dans AbsenceWrapper:", motifs);
    console.log("Evidence reçue du premier motif:", motifs[0]?.evidence);
    setCancelledAbsenceMotifs(motifs);

    if (motifs.length > 0 && motifs[0]?.evidence && !originalEvidence) {
      setOriginalEvidence(motifs[0].evidence);

      if (!evidence) {
        setEvidence(motifs[0].evidence);
      }
    }
  };

  useEffect(() => {
    if (studentId && token) {
      setStudentData(studentId, token);
    }
  }, [studentId, token, setStudentData]);

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
      return await getStudentsGroups(studentId, token);
    },
    enabled: !!studentId && !!token,
  });

  const groups = groupsData?.result?.group_list || [];

  useEffect(() => {
    if (!isLoading && groups.length === 1 && showGroupModal) {
      handleGroupSelection(groups[0]);
    }
  }, [groups, showGroupModal, isLoading]);

  const handleGroupSelection = (group: Group) => {
    setSelectedGroup({ id: group.id, name: group.name });
    setShowGroupModal(false);
    setShowDatesModal(true);
  };

  const handleDatesModalClose = () => {
    setShowDatesModal(false);
    onClose();
  };

  const handleBack = () => {
    setShowDatesModal(false);
    setShowGroupModal(true);
  };

  const redirectToDashboard = () => {
    router.push("/home-student");
  };

  const handleDeclarationValidate = () => {
    setShowDeclarationModal(false);
    setShowConfirmationModal(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmationModal(false);
    onClose();
    redirectToDashboard();
  };

  const handleValidate = (
    currentActiveAbsences: ActiveAbsence[],
    currentSelectedDates: string[]
  ) => {
    console.log("=== VALIDATION DANS ABSENCE WRAPPER ===");
    console.log("Dates sélectionnées reçues:", currentSelectedDates);
    console.log("Type des dates:", typeof currentSelectedDates);
    console.log("Est-ce un tableau?", Array.isArray(currentSelectedDates));
    console.log("Absences actives:", currentActiveAbsences);
    console.log("Motifs d'absence annulés:", cancelledAbsenceMotifs);

    const validatedDates = Array.isArray(currentSelectedDates)
      ? currentSelectedDates
      : [];

    setCurrentDatesForDeclaration(validatedDates);
    selectedDatesFunctions.set(validatedDates);
    setActiveAbsences(currentActiveAbsences);

    const hasNewDates = validatedDates.length > 0;
    const hasCancelledAbsences = cancelledAbsenceMotifs.length > 0;

    if (!hasNewDates && !hasCancelledAbsences) {
      alert(
        "Veuillez sélectionner au moins une date ou annuler une absence existante avant de continuer."
      );
      return;
    }

    if (!evidence || evidence.trim() === "") {
      if (
        cancelledAbsenceMotifs.length > 0 &&
        cancelledAbsenceMotifs[0]?.evidence
      ) {
        console.log(
          "Utilisation du motif d'absence annulée:",
          cancelledAbsenceMotifs[0].evidence
        );
        setEvidence(cancelledAbsenceMotifs[0].evidence);
      } else if (originalEvidence) {
        console.log("Utilisation du motif original:", originalEvidence);
        setEvidence(originalEvidence);
      }
    }

    setShowDatesModal(false);
    setShowDeclarationModal(true);
  };

  return (
    <>
      <Modal
        opened={showGroupModal && isOpen && groups.length > 1}
        onClose={onClose}
        radius="lg"
        centered
        withCloseButton={false}
      >
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">Déclarer une absence</h1>
          <h2 className="text-md font-semibold">Choisir un groupe</h2>
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
                  {group.name || "Nom du cours indisponible"}
                </p>
                <p className="text-xs font-light">
                  {formatDayToThreeLetters(group.slot)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        opened={showDatesModal && isOpen}
        onClose={handleDatesModalClose}
        radius="lg"
        centered
        withCloseButton={false}
      >
        {selectedGroup && (
          <StudentSpaceDates
            group_id={selectedGroup.id.toString()}
            student_id={studentId?.toString() || ""}
            token={token || ""}
            name={selectedGroup.name}
            onClickCancel={groups.length > 1 ? handleBack : onClose}
            onClickValidate={handleValidate}
            selectedDates={selectedDates}
            selectedDatesFunctions={selectedDatesFunctions}
            onCancelledAbsencesChange={handleCancelledAbsencesChange}
          />
        )}
      </Modal>

      <Modal
        opened={showDeclarationModal && isOpen}
        onClose={onClose}
        radius="lg"
        centered
        withCloseButton={false}
      >
        <DeclareStudentAp
          onClickCancel={() => {
            setShowDeclarationModal(false);
            setShowDatesModal(true);
          }}
          onClickValidate={handleDeclarationValidate}
          selectedDates={currentDatesForDeclaration}
          activeAbsences={activeAbsences}
          groupId={selectedGroup?.id || 0}
          evidence={evidence}
          setEvidence={setEvidence}
          cancelledAbsenceMotifs={cancelledAbsenceMotifs}
        />
      </Modal>
      <Modal
        opened={showConfirmationModal && isOpen}
        onClose={handleConfirmationClose}
        radius="lg"
        centered
        withCloseButton={false}
      >
        <AbsenceConfirmation onClose={handleConfirmationClose} />
      </Modal>
    </>
  );
}

export default AbsenceWrapper;
