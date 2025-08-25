"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { displayDate, formatDayToThreeLetters } from "@/lib/dates";
import {
  decodeHtml,
  formatCourseName,
  formatTitleInTwoLines,
  truncateFileName,
} from "@/lib/format-utils";
import Button from "@/components/Button";
import { FaTrash, FaEye } from "react-icons/fa";
import { Modal } from "@mantine/core";
import { useTeacher } from "@/app/TeacherContext";
import ValidateWithoutHomework from "@/components/ValidateWithoutHomework";
import AddHomework from "@/components/AddHomework";
import {
  fetchWorkbookSessionInfo,
  AddDocumentPayload,
  WorkbookSessionDocument,
} from "@/api/index";
import { useQuery } from "@tanstack/react-query";
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

const AbstractPage = () => {
  const router = useRouter();
  const search = useSearchParams();
  const groupName = search.get("groupName");
  const groupSlot = search.get("groupSlot");
  const date = search.get("date") ?? "";
  const groupId = Number(search.get("groupId"));
  const pageId = Number(search.get("pageId"));
  const { teacherId } = useTeacher();
  const [summaryFile, setSummaryFile] = useState<CustomFile | null>(null);
  const [showAddHomeworkModal, setShowAddHomeworkModal] = useState(false);
  const [
    showValidateWithoutHomeworkModal,
    setShowValidateWithoutHomeworkModal,
  ] = useState(false);
  const [courseSummary, setCourseSummary] = useState<string>("");
  const [abUrlList, setAbUrlList] = useState<WorkbookSessionDocument[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<WorkbookSessionDocument | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

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
      const abstract = decodeHtml(session.abstract || "");

      setCourseSummary(
        abstract === "no_workbook" || abstract === "NA" ? "" : abstract
      );
      setAbUrlList(session.abUrlList || []);
    }
  }, [workbookSessionInfoResponse]);

  useEffect(() => {
    const savedAbstract = localStorage.getItem(`abstract_${teacherId}_${date}`);
    const savedAbUrlList = localStorage.getItem(
      `abUrlList_${teacherId}_${date}`
    );

    if (savedAbstract) {
      const abstract = decodeHtml(savedAbstract);
      setCourseSummary(
        abstract === "no_workbook" || abstract === "NA" ? "" : abstract
      );
    }

    if (savedAbUrlList) {
      setAbUrlList(JSON.parse(savedAbUrlList));
    }
  }, [teacherId, date]);

  useEffect(() => {
    if (
      courseSummary &&
      courseSummary !== "no_workbook" &&
      courseSummary !== "NA"
    ) {
      localStorage.setItem(`abstract_${teacherId}_${date}`, courseSummary);
    }

    if (abUrlList.length) {
      localStorage.setItem(
        `abUrlList_${teacherId}_${date}`,
        JSON.stringify(abUrlList)
      );
    }
  }, [courseSummary, abUrlList, teacherId, date]);

  const addDocumentMutation = useAddDocument(
    teacherId!,
    groupId,
    date,
    setAbUrlList,
    () => {}
  );

  const deleteDocumentMutation = useDeleteDocument(
    teacherId!,
    groupId,
    date,
    setAbUrlList,
    () => {}
  );

  const handleSummaryFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const payload: Omit<AddDocumentPayload, "file_content"> = {
        id: pageId,
        file_name: file.name,
        file_mime: file.type,
        file_type: "ab",
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

  const navigateToHomeworkPage = () => {
    localStorage.setItem(`abstract_${teacherId}_${date}`, courseSummary);
    localStorage.setItem(
      `abUrlList_${teacherId}_${date}`,
      JSON.stringify(abUrlList)
    );

    router.push(
      `/cahier-seances/c-seance-page/Homework-page?pageId=${pageId}&groupId=${groupId}&groupName=${encodeURIComponent(
        groupName || ""
      )}&groupSlot=${encodeURIComponent(
        groupSlot || ""
      )}&date=${date}&abstract=${encodeURIComponent(courseSummary)}`
    );
  };

  const openAddHomeworkModal = () => {
    setShowAddHomeworkModal(true);
  };

  const closeAddHomeworkAndOpenValidation = () => {
    localStorage.setItem(`courseSummary_${teacherId}`, courseSummary);
    setShowAddHomeworkModal(false);
    setShowValidateWithoutHomeworkModal(true);
  };

  const closeValidateWithoutHomeworkModal = () => {
    setShowValidateWithoutHomeworkModal(false);
  };

  if (isLoading) return <p>Chargement des données...</p>;
  if (error) return <p>Erreur lors du chargement des données.</p>;

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden md:hidden">
      <style jsx global>{`
        .custom-quill .ql-editor {
          font-size: 1rem;
        }
      `}</style>
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
            Résumé du cours :
          </h2>
          <Editor
            value={decodeHtml(courseSummary)}
            onChange={setCourseSummary}
            placeholder=""
            className="h-80 mx-auto"
          />

          <div className="mt-2">
            <div className="flex items-center justify-between mt-4">
              <div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleSummaryFileChange}
                  className="hidden"
                  id="summary-file-input"
                />
                <label
                  htmlFor="summary-file-input"
                  className="cursor-pointer px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-black"
                >
                  Joindre un fichier
                </label>
              </div>
            </div>
            <div className="mt-4">
              {abUrlList.map((doc, index) => (
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
                      onClick={() => handleDeleteDocument(doc.name, "ab")}
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
      </div>

      <div className="w-full flex justify-center items-center bg-white py-3 sticky bottom-0 mb-2">
        <Button
          className="h-11 block font-bold text-center flex justify-center items-center"
          variant="green"
          onClick={openAddHomeworkModal}
        >
          Valider le résumé du cours
        </Button>
      </div>

      <DocumentViewer
        document={selectedDocument}
        isOpen={isDocumentViewerOpen}
        onClose={closeDocumentViewer}
      />

      <Modal
        opened={showAddHomeworkModal}
        onClose={() => setShowAddHomeworkModal(false)}
        withCloseButton={false}
        radius="lg"
        centered
      >
        <AddHomework
          onValidate={() => {
            setShowAddHomeworkModal(false);
            navigateToHomeworkPage();
          }}
          onClickCancel={closeAddHomeworkAndOpenValidation}
        />
      </Modal>

      <Modal
        opened={showValidateWithoutHomeworkModal}
        onClose={closeValidateWithoutHomeworkModal}
        withCloseButton={false}
        radius="lg"
        centered
      >
        {Number.isInteger(groupId) &&
          groupId !== null &&
          teacherId !== null && (
            <ValidateWithoutHomework
              onValidate={closeValidateWithoutHomeworkModal}
              onClickCancel={closeValidateWithoutHomeworkModal}
              groupId={groupId}
              teacherId={teacherId}
              date={date}
              abstract={courseSummary}
              summaryFile={summaryFile}
            />
          )}
      </Modal>
    </div>
  );
};

export default AbstractPage;
