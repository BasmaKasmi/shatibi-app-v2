import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddDocumentPayload,
  AddDocumentResponse,
  addDocumentToWorkbook,
  WorkbookSessionDocument,
  deleteDocument,
  DeleteDocumentPayload,
  DeleteDocumentResponse,
  WorkbookSessionInfo,
} from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { encodeFileToBase64 } from "@/lib/format-utils";

interface DeleteDocumentContext {
  previousState: any;
}

export const useAddDocument = (
  teacherId: number,
  groupId: number,
  date: string,
  setAbUrlList: React.Dispatch<React.SetStateAction<WorkbookSessionDocument[]>>,
  setHwUrlList: React.Dispatch<React.SetStateAction<WorkbookSessionDocument[]>>
) => {
  const queryClient = useQueryClient();

  return useMutation<
    AddDocumentResponse,
    Error,
    { file: File; payload: Omit<AddDocumentPayload, "file_content"> }
  >({
    mutationFn: async ({ file, payload }) => {
      const fileBase64Content: string = await encodeFileToBase64(file);
      const updatedPayload: AddDocumentPayload = {
        ...payload,
        file_content: fileBase64Content,
      };
      return await addDocumentToWorkbook(updatedPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.WORKBOOK_SESSION_INFO, teacherId, groupId, date],
      });
    },
    onError: (error) => {
      console.error(
        "Erreur lors de la requête d'ajout de document:",
        error.message
      );
    },
  });
};

export const useDeleteDocument = (
  teacherId: number,
  groupId: number,
  date: string,
  setAbUrlList: React.Dispatch<React.SetStateAction<WorkbookSessionDocument[]>>,
  setHwUrlList: React.Dispatch<React.SetStateAction<WorkbookSessionDocument[]>>
) => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteDocumentResponse,
    Error,
    DeleteDocumentPayload,
    DeleteDocumentContext
  >({
    mutationFn: deleteDocument,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.WORKBOOK_SESSION_INFO, teacherId, groupId, date],
      });

      const previousState = queryClient.getQueryData([
        QUERY_KEY.WORKBOOK_SESSION_INFO,
        teacherId,
        groupId,
        date,
      ]);

      if (variables.file_type === "ab") {
        const currentAbDocs =
          queryClient.getQueryData<any>([
            QUERY_KEY.WORKBOOK_SESSION_INFO,
            teacherId,
            groupId,
            date,
          ])?.result?.[0]?.abUrlList || [];

        const updatedAbDocs = currentAbDocs.filter(
          (doc: WorkbookSessionDocument) => doc.name !== variables.file_name
        );

        setAbUrlList(updatedAbDocs);

        localStorage.setItem(
          `abUrlList_${teacherId}_${date}`,
          JSON.stringify(updatedAbDocs)
        );
      } else if (variables.file_type === "hw") {
        const currentHwDocs =
          queryClient.getQueryData<any>([
            QUERY_KEY.WORKBOOK_SESSION_INFO,
            teacherId,
            groupId,
            date,
          ])?.result?.[0]?.hwUrlList || [];

        const updatedHwDocs = currentHwDocs.filter(
          (doc: WorkbookSessionDocument) => doc.name !== variables.file_name
        );

        setHwUrlList(updatedHwDocs);

        localStorage.setItem(
          `hwUrlList_${teacherId}_${date}`,
          JSON.stringify(updatedHwDocs)
        );
      }

      return { previousState };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.WORKBOOK_SESSION_INFO, teacherId, groupId, date],
      });
    },
    onError: (error, variables, context) => {
      if (error.message === "no_document") {
        console.log(
          "Document non trouvé sur le serveur, considéré comme déjà supprimé"
        );
        return;
      }

      console.error(
        "Erreur lors de la suppression du document:",
        error.message
      );

      if (context?.previousState) {
        queryClient.setQueryData(
          [QUERY_KEY.WORKBOOK_SESSION_INFO, teacherId, groupId, date],
          context.previousState
        );

        const session = Array.isArray(context.previousState.result)
          ? context.previousState.result[0]
          : context.previousState.result;

        if (session) {
          if (variables.file_type === "ab" && session.abUrlList) {
            setAbUrlList(session.abUrlList);
          } else if (variables.file_type === "hw" && session.hwUrlList) {
            setHwUrlList(session.hwUrlList);
          }
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.WORKBOOK_SESSION_INFO, teacherId, groupId, date],
      });
    },
  });
};
