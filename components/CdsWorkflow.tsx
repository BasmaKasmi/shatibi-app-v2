"use client";
import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { useRouter } from "next/navigation";
import CdsGroups from "./CdsGroups";
import { CdsDates } from "./CdsDates";
import { ClassWork } from "./Classwork";
import { useTeacher } from "@/app/TeacherContext";

interface SelectedGroup {
  id: string;
  name: string;
  slot: string;
}

interface CdsWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "resume" | "devoir";
  returnUrl?: string;
}

interface WorkbookItem {
  id: number;
  date: string;
}

export const CdsWorkflow: React.FC<CdsWorkflowProps> = ({
  isOpen,
  onClose,
  defaultTab = "resume",
  returnUrl,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    "groups" | "dates" | "classwork"
  >("groups");
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [workbookData, setWorkbookData] = useState<WorkbookItem[]>([]);
  const [selectedWorkbookId, setSelectedWorkbookId] = useState<number | null>(
    null
  );

  const { teacherId } = useTeacher();

  const handleWorkbookDataChange = React.useCallback((data: WorkbookItem[]) => {
    setWorkbookData(data);
    console.log(" Workbook data received:", data);
  }, []);

  const getWorkbookIdForDate = React.useCallback(
    (date: string): number | null => {
      const workbook = workbookData.find((wb) => wb.date === date);
      console.log(`Looking for workbook ID for date ${date}:`, workbook);
      return workbook?.id || null;
    },
    [workbookData]
  );

  const selectedDatesFunctions = React.useMemo(
    () => ({
      push: (date: string, workbookId?: number) => {
        setSelectedDates((prev) => [...prev, date]);
        console.log(`Date ${date} selected with workbookId: ${workbookId}`);
      },
      removeAt: (index: number) => {
        setSelectedDates((prev) => prev.filter((_, i) => i !== index));
      },
    }),
    []
  );

  const handleGroupSelect = React.useCallback((group: SelectedGroup) => {
    setSelectedGroup(group);
    setCurrentStep("dates");
  }, []);

  const handleDatesValidate = React.useCallback(() => {
    if (selectedDates.length > 0) {
      const firstDate = selectedDates[0];
      setSelectedDate(firstDate);

      const workbookId = getWorkbookIdForDate(firstDate);
      setSelectedWorkbookId(workbookId);

      console.log(`Selected date: ${firstDate}, workbookId: ${workbookId}`);
      setCurrentStep("classwork");
    }
  }, [selectedDates, getWorkbookIdForDate]);

  const handleDatesCancel = React.useCallback(() => {
    setCurrentStep("groups");
    setSelectedDates([]);
    setSelectedWorkbookId(null);
  }, []);

  const handleClassWorkComplete = React.useCallback(() => {
    setCurrentStep("groups");
    setSelectedGroup(null);
    setSelectedDate("");
    setSelectedDates([]);
    setSelectedWorkbookId(null);

    onClose();

    if (returnUrl) {
      console.log("Redirection vers l'URL complète:", returnUrl);
      router.push(returnUrl);
    }
  }, [onClose, returnUrl, router]);

  const handleClose = React.useCallback(() => {
    setCurrentStep("groups");
    setSelectedGroup(null);
    setSelectedDate("");
    setSelectedDates([]);
    setSelectedWorkbookId(null);
    onClose();
  }, [onClose]);

  const generateWorkbookId = React.useCallback((): number => {
    if (selectedWorkbookId) {
      console.log("Using REAL workbookId:", selectedWorkbookId);
      return selectedWorkbookId;
    }

    console.log("No real workbookId found, using fallback");
    return 0;
  }, [selectedWorkbookId]);

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      withCloseButton={false}
      radius="lg"
      centered
      size="lg"
    >
      {currentStep === "groups" && (
        <CdsGroups onGroupSelect={handleGroupSelect} />
      )}

      {currentStep === "dates" && selectedGroup && (
        <CdsDates
          group_id={selectedGroup.id}
          student_id=""
          name={selectedGroup.name}
          onClickCancel={handleDatesCancel}
          onClickValidate={handleDatesValidate}
          selectedDates={selectedDates}
          selectedDatesFunctions={selectedDatesFunctions}
          onWorkbookDataChange={handleWorkbookDataChange}
        />
      )}

      {currentStep === "classwork" &&
        selectedGroup &&
        selectedDate &&
        teacherId && (
          <ClassWork
            name={selectedGroup.name}
            groupId={Number(selectedGroup.id)}
            teacherId={teacherId}
            studentId={0}
            date={selectedDate}
            workbookId={generateWorkbookId()}
            onComplete={handleClassWorkComplete}
            defaultTab={defaultTab}
          />
        )}
    </Modal>
  );
};
