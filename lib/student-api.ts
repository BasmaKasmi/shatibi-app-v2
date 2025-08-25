import BackendApi from "./backend-api";

export interface LoginStudentCredentials {
  login: string;
  password: string;
}

export interface LoginStudentResponse {
  code: string;
  status: "fail" | "success";
  error: string;
  result?: {
    id: number;
    lastname: string;
    firstname: string;
    active: boolean;
    change_pwd: boolean;
    token: string;
  };
}

export interface StudentAttendanceResponse {
  status: "fail" | "success";
  error?: "no_request" | "no_year" | "no_group" | "no_attendance" | string;
  result: Array<{
    date: string;
    absent: "0" | "1";
    evidence?: string;
  }>;
}
export interface StudentAttendanceParams {
  group_id: number;
  student_id: number;
  token: string;
  start_date: string;
  end_date?: string;
  include_evidence?: boolean;
}

export interface ChangePasswordPayload {
  student_id: number;
  token: string;
  password: string;
  password_confirm: string;
}

export interface ChangePasswordResponse {
  code: string;
  status: "success" | "fail";
  error?: string;
  result?: [];
}

export interface Group {
  id: number;
  name: string;
  slot: string;
  session: string;
  classroom?: string;
  level_valid?: string;
  workbook_required?: boolean;
}

export interface StudentsGroupsResponse {
  code: string;
  status: "success" | "fail";
  error?: string;
  result?: {
    lastname: string;
    firstname: string;
    group_list: Group[];
  };
}

export interface StudentWorkbook {
  id: number;
  date: string;
  validate: boolean;
  abstract: string;
  homework: string;
  abUrlList: { name: string; url: string }[];
  hwUrlList: { name: string; url: string }[];
}

export interface StudentWorkbookListApiResponse {
  code: string;
  status: "success" | "fail";
  error?: string;
  result: StudentWorkbook[];
}

export interface StudentAbsencePayload {
  token: string;
  group_id: number;
  student_id: number;
  date_list: {
    date: string;
    absence: string;
    evidence: string;
  }[];
}

export interface StudentAbsenceResponse {
  status: "success" | "fail";
  error?: {
    no_request?: string;
    no_student?: string;
    token_not_match?: string;
    token_expire?: string;
    no_date?: string;
  };
  result: any[];
}

export interface StudentGroupInfoResponse {
  status: "fail" | "success";
  error: string;
  result?: {
    absence: number;
    nb_ai: number;
    presence_rate: number;
    session: string;
  };
}
export interface GroupAttendanceStudent {
  id: number;
  name: string;
  absent: boolean;
  motive: string;
  abort: string;
  date: string;
  hour: string;
  evidence: string;
}

export interface GroupAttendanceRequest {
  group_id: number;
  student_id: number;
  date: string;
  token: string;
}
export interface GroupAttendanceStudent {
  id: number;
  name: string;
  absent: boolean;
  motive: string;
  abort: string;
  date: string;
  hour: string;
  evidence: string;
}

export interface GroupAttendanceResponse {
  status: "success" | "fail";
  error?: "no_request" | string;
  result: GroupAttendanceStudent[];
}

export interface StudentWorkbookContentRequest {
  group_id: number;
  student_id: number;
  date: string;
  token: string;
}

export interface WorkbookContentFile {
  name: string;
  coUrl: string;
}

export interface StudentWorkbookContentResponse {
  code: string;
  status: "success" | "fail";
  error?: string;
  result?: {
    id: number;
    liaison_id: number;
    date: string;
    validated: boolean;
    liaison: string;
    homework: string;
    coUrlList: WorkbookContentFile[];
  };
}

export interface ValidateStudentWorkbookContentPayload {
  liaison_id: number;
  student_id: number;
  token: string;
}

export interface ValidateStudentWorkbookContentResponse {
  code: string;
  status: "success" | "fail";
  error?: string;
  result: any[];
}

export interface StudentContentListRequest {
  student_id: number;
  token: string;
  group_id: number;
}

export interface StudentDocumentFile {
  name: string;
  stUrl: string;
}

export interface StudentContentItem {
  workbook_id: number;
  date: string;
  liaison_id: number;
  validated: string;
  validated_date: string;
  docList?: StudentDocumentFile[];
}

export interface StudentContentListResponse {
  code: string;
  status: "success" | "fail";
  error: string;
  result: StudentContentItem[];
}

export interface AddDocumentPayload {
  student_id: number;
  token: string;
  liaison_id: number;
  file_name: string;
  file_mime: string;
  file_content: string;
}

export interface AddDocumentResponse {
  code: string;
  status: "success" | "fail";
  error: string;
  result: any[];
}

export interface DeleteDocumentPayload {
  student_id: number;
  token: string;
  liaison_id: number;
  file_name: string;
}

export interface DeleteDocumentResponse {
  code: string;
  status: "success" | "fail";
  error: string;
  result: any[];
}

export const getStudentAttendanceDates = async (
  params: StudentAttendanceParams
): Promise<StudentAttendanceResponse> => {
  const response = await BackendApi.post<StudentAttendanceResponse>(
    "/student/attendance/group/student",
    {
      group_id: params.group_id,
      student_id: params.student_id,
      token: params.token,
      start_date: params.start_date,
      end_date: params.end_date || null,
    }
  );

  if (response.data.status !== "success") {
    throw new Error(response.data.error || "Failed to fetch attendance dates");
  }

  return response.data;
};

export const loginStudent = async (
  credentials: LoginStudentCredentials
): Promise<LoginStudentResponse> => {
  const response = await BackendApi.post<LoginStudentResponse>(
    "/student/external/login",
    credentials
  );
  return response.data;
};

export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  const response = await BackendApi.post<ChangePasswordResponse>(
    "/student/external/change/password",
    payload
  );

  if (response.data.status === "fail") {
    throw new Error(
      response.data.error || "Erreur lors du changement de mot de passe"
    );
  }

  return response.data;
};

export const getStudentsGroups = async (
  studentId: number,
  token: string
): Promise<StudentsGroupsResponse> => {
  const response = await BackendApi.post<StudentsGroupsResponse>(
    "/student/find/group/list",
    {
      student_id: studentId,
      token: token,
    }
  );

  if (response.data.status === "fail") {
    throw new Error(
      response.data.error || "Erreur lors de la récupération des groupes."
    );
  }

  return response.data;
};

export const getStudentWorkbookList = async (
  studentId: number,
  token: string,
  groupId: number,
  startDate: string,
  endDate: string
): Promise<StudentWorkbookListApiResponse> => {
  const response = await BackendApi.post<StudentWorkbookListApiResponse>(
    "/student/workbook/list/group",
    {
      student_id: studentId,
      token: token,
      group_id: groupId,
      start_date: startDate,
      end_date: endDate,
    }
  );

  if (response.data.status === "fail") {
    throw new Error(
      response.data.error ||
        "Erreur lors de la récupération des cahiers de séance."
    );
  }

  return response.data;
};

export const declareStudentAbsence = async (
  payload: StudentAbsencePayload
): Promise<StudentAbsenceResponse> => {
  const response = await BackendApi.post<StudentAbsenceResponse>(
    "/student/prepare/attendance",
    payload
  );

  return response.data;
};

export const getStudentDatesForMonth = async (
  groupId: number,
  month: string,
  studentId: number,
  token: string
): Promise<string[]> => {
  const response = await BackendApi.post("/student/agenda/group/year", {
    student_id: studentId,
    group_id: groupId,
    month,
    token,
  });

  if (response.data.status !== "success") {
    throw new Error(response.data.error);
  }

  const result = response.data.result;
  if (Array.isArray(result)) return [];

  const onlyKeyOfResult = Object.keys(result)[0];
  return result[onlyKeyOfResult] as string[];
};

export const getStudentGroupInfo = async (
  studentId: number,
  groupId: number,
  token: string
): Promise<StudentGroupInfoResponse> => {
  const response = await BackendApi.post<StudentGroupInfoResponse>(
    "/student/group/info",
    {
      student_id: studentId,
      group_id: groupId,
      token: token,
    }
  );

  return response.data;
};

export const getGroupAttendance = async (
  params: GroupAttendanceRequest
): Promise<GroupAttendanceResponse> => {
  try {
    const response = await BackendApi.post<GroupAttendanceResponse>(
      "/student/attendance/group",
      params
    );

    if (response.data.status === "fail") {
      throw new Error(
        response.data.error ||
          "Échec de la récupération des données d'assiduité"
      );
    }

    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des données d'assiduité");
  }
};

export const getStudentWorkbookContent = async (
  params: StudentWorkbookContentRequest
): Promise<StudentWorkbookContentResponse> => {
  try {
    const response = await BackendApi.post<StudentWorkbookContentResponse>(
      "/student/workbook/content/info",
      {
        group_id: params.group_id,
        student_id: params.student_id,
        date: params.date,
        token: params.token,
      }
    );

    if (response.data.status !== "success") {
      throw new Error(
        response.data.error ||
          "Erreur lors de la récupération de la correspondance de l'étudiant"
      );
    }

    return response.data;
  } catch (error) {
    console.error("Erreur API getStudentWorkbookContent:", error);
    throw error;
  }
};

export const validateStudentWorkbookContent = async (
  payload: ValidateStudentWorkbookContentPayload
): Promise<ValidateStudentWorkbookContentResponse> => {
  try {
    const response =
      await BackendApi.post<ValidateStudentWorkbookContentResponse>(
        "/student/workbook/content/validate",
        payload
      );

    if (response.data.status !== "success") {
      throw new Error(
        response.data.error ||
          "Erreur lors de la validation du travail individuel"
      );
    }

    return response.data;
  } catch (error) {
    console.error("Erreur API validateStudentWorkbookContent:", error);
    throw error;
  }
};

export const getStudentContentList = async (
  params: StudentContentListRequest
): Promise<StudentContentListResponse> => {
  try {
    const response = await BackendApi.post<StudentContentListResponse>(
      "/student/content/list/group",
      {
        student_id: params.student_id,
        token: params.token,
        group_id: params.group_id,
      }
    );

    if (response.data.status !== "success") {
      throw new Error(
        response.data.error ||
          "Erreur lors de la récupération de la liste des devoirs de l'étudiant"
      );
    }

    return response.data;
  } catch (error) {
    console.error("Erreur API getStudentContentList:", error);
    throw error;
  }
};

export const addStudentDocument = async (
  payload: AddDocumentPayload
): Promise<AddDocumentResponse> => {
  try {
    const response = await BackendApi.post<AddDocumentResponse>(
      "/student/workbook/content/document/new",
      payload
    );

    if (response.data.status !== "success") {
      throw new Error(
        response.data.error ||
          "Erreur lors de l'ajout du document de correspondance"
      );
    }

    return response.data;
  } catch (error) {
    console.error("Erreur API addStudentDocument:", error);
    throw error;
  }
};

export const deleteStudentDocument = async (
  payload: DeleteDocumentPayload
): Promise<DeleteDocumentResponse> => {
  try {
    const response = await BackendApi.post<DeleteDocumentResponse>(
      "/student/workbook/content/document/delete",
      payload
    );

    if (response.data.status !== "success") {
      throw new Error(
        response.data.error ||
          "Erreur lors de la suppression du document de correspondance"
      );
    }

    return response.data;
  } catch (error) {
    console.error("Erreur API deleteStudentDocument:", error);
    throw error;
  }
};
