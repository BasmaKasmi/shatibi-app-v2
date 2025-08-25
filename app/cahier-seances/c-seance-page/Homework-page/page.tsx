"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Modal } from "@mantine/core";
import CahierSeanceModal from "@/components/CahierSeanceModal";
import { useTeacher } from "@/app/TeacherContext";
import { FaTrash, FaEye } from "react-icons/fa";
import {
  decodeHtml,
  formatCourseName,
  formatTitleInTwoLines,
  truncateFileName,
} from "@/lib/format-utils";
import { displayDate, formatDayToThreeLetters } from "@/lib/dates";
import Button from "@/components/Button";
import {
  fetchWorkbookSessionInfo,
  AddDocumentPayload,
  WorkbookSessionDocument,
} from "@/api/index";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/queries";
import { useAddDocument, useDeleteDocument } from "@/app/Mutations";
import Editor from "@/components/Editor";
import EvaluationHeader from "@/components/EvaluationHeader";
import DocumentViewer from "@/components/DocumentViewer";

interface CustomFile {
  name: string;
  base64: string;
  mime: string;
  file: File;
}

const HomeworkPage = () => {
  const [opened, setOpened] = useState(false);
  const search = useSearchParams();
  const groupName = search.get("groupName");
  const groupSlot = search.get("groupSlot");
  const pageId = Number(search.get("pageId"));
  const date = search.get("date") ?? "";
  const groupId = Number(search.get("groupId"));
  const { teacherId } = useTeacher();
  const [homework, setHomework] = useState<string>("");
  const [summaryFile, setSummaryFile] = useState<CustomFile | null>(null);
  const [courseSummary, setCourseSummary] = useState<string>("");
  const [homeworkFile, setHomeworkFile] = useState<CustomFile | null>(null);
  const [hwUrlList, setHwUrlList] = useState<WorkbookSessionDocument[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<WorkbookSessionDocument | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const addDocumentMutation = useAddDocument(
    teacherId!,
    groupId,
    date,
    () => {},
    setHwUrlList
  );

  const deleteDocumentMutation = useDeleteDocument(
    teacherId!,
    groupId,
    date,
    () => {},
    setHwUrlList
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data: workbookSessionInfoResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY.WORKBOOK_SESSION_INFO, teacherId, groupId, date],
    queryFn: () => fetchWorkbookSessionInfo(teacherId!, groupId!, date),
    enabled: !!teacherId && !!groupId && !!date,
  });

  useEffect(() => {
    const result = workbookSessionInfoResponse?.result;

    if (result) {
      const session = Array.isArray(result) ? result[0] : result;
      const hwContent = decodeHtml(session.homework || "");

      setHomework(
        hwContent === "no_workbook" || hwContent === "NA" ? "" : hwContent
      );
      setHwUrlList(session.hwUrlList || []);
    }
  }, [workbookSessionInfoResponse]);

  useEffect(() => {
    const savedHomework = localStorage.getItem(`homework_${teacherId}_${date}`);
    const savedHwUrlList = localStorage.getItem(
      `hwUrlList_${teacherId}_${date}`
    );

    if (savedHomework) {
      const hwContent = decodeHtml(savedHomework);
      setHomework(
        hwContent === "no_workbook" || hwContent === "NA" ? "" : hwContent
      );
    }

    if (savedHwUrlList) {
      try {
        setHwUrlList(JSON.parse(savedHwUrlList) as WorkbookSessionDocument[]);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des documents depuis le localStorage:",
          error
        );
      }
    }
  }, [teacherId, date]);

  useEffect(() => {
    if (homework && homework !== "no_workbook" && homework !== "NA") {
      localStorage.setItem(`homework_${teacherId}_${date}`, homework);
    }

    if (hwUrlList.length) {
      localStorage.setItem(
        `hwUrlList_${teacherId}_${date}`,
        JSON.stringify(hwUrlList)
      );
    }
  }, [homework, hwUrlList, teacherId, date]);

  const handleHomeworkFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const payload: Omit<AddDocumentPayload, "file_content"> = {
        id: pageId,
        file_name: file.name,
        file_mime: file.type,
        file_type: "hw",
      };

      await addDocumentMutation.mutateAsync(
        { file, payload },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout du fichier :", error);
    }
  };

  const handleDeleteDocument = (fileName: string, fileType: "ab" | "hw") => {
    deleteDocumentMutation.mutate({
      id: pageId,
      file_name: fileName,
      file_type: fileType,
    });
  };

  const openDocumentViewer = (document: WorkbookSessionDocument) => {
    setSelectedDocument(document);
    setIsDocumentViewerOpen(true);
  };

  const closeDocumentViewer = () => {
    setIsDocumentViewerOpen(false);
    setSelectedDocument(null);
  };

  const openModal = () => setOpened(true);
  const closeModal = () => setOpened(false);

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden md:hidden">
      <style jsx global>{`
        .custom-quill .ql-editor {
          font-size: 1rem;
        }
      `}</style>

      <DocumentViewer
        document={selectedDocument}
        isOpen={isDocumentViewerOpen}
        onClose={closeDocumentViewer}
      />

      <Modal
        opened={opened}
        onClose={closeModal}
        withCloseButton={false}
        radius="lg"
        centered
      >
        {Number.isInteger(groupId) &&
          groupId !== null &&
          teacherId !== null && (
            <CahierSeanceModal
              onClickValidate={closeModal}
              onClickCancel={closeModal}
              group_id={groupId}
              teacher_id={teacherId}
              date={date}
              abstract={courseSummary}
              homework={homework}
              abstract_file={summaryFile}
              homework_file={homeworkFile}
              group_name={groupName || ""}
              group_slot={groupSlot || ""}
            />
          )}
      </Modal>

      <div className="px-5 py-4">
        <EvaluationHeader title="Cahier de séance" />
      </div>
      {groupName && groupSlot && (
        <div className="-mt-3">
          <h1 className="text-xl font-bold text-center">
            {formatTitleInTwoLines(formatCourseName(groupName))}
          </h1>
          <div className="flex justify-center gap-2">
            <p className="text-md font-semibold">
              {formatDayToThreeLetters(groupSlot)} le
            </p>
            {date && (
              <p className="text-md font-semibold">{displayDate(date)}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-gray-500 text-sm font-semibold mb-3 pl-2">
            Travail à faire :
          </h2>
          <div className="border border-gray-300 text-lg rounded-lg bg-white">
            <Editor
              value={homework}
              onChange={setHomework}
              placeholder=""
              className="h-80 mx-auto"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={handleHomeworkFileChange}
                className="hidden"
                id="homework-file-input"
              />
              <label
                htmlFor="homework-file-input"
                className="cursor-pointer px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-black"
              >
                Joindre un fichier
              </label>
            </div>
          </div>
          <div className="mt-4">
            {hwUrlList.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <div className="min-w-0 flex-1">
                  <span
                    className="block truncate hover:text-blue-500 cursor-pointer"
                    title={doc.name}
                    onClick={() => openDocumentViewer(doc)}
                  >
                    {truncateFileName(doc.name)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openDocumentViewer(doc)}
                    className="text-blue-500"
                    title="Visualiser"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc.name, "hw")}
                    className="text-red-500"
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center bg-white py-3 sticky bottom-0 mb-2">
        <Button
          className="h-11 block font-bold text-center flex justify-center items-center"
          variant="green"
          onClick={openModal}
        >
          Valider le travail à faire
        </Button>
      </div>
    </div>
  );
};

export default HomeworkPage;
