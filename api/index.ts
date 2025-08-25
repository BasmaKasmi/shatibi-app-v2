import BackendApi from "@/lib/backend-api";
import { ObjectId } from "mongoose";

export interface AttendanceApiResponse {
  status: string;
  error?: string;
  result: EmargementGroup[];
}

export type StudentList = {
  id: number;
  nb_ap: number | null;
  nb_ai: number | null;
};

export interface Attendance {
  id: number;
  date: string;
  validate: boolean;
}

export interface EmargementDate {
  date: string;
  time: string;
  session: number;
}

export interface EmargementGroup {
  id: number;
  name: string;
  slot: string;
  date_list: EmargementDate[];
}

export interface RecoveryResponse {
  message: string;
}

export interface ResetPasswordSuccessResponse {
  message: string;
}

export interface ResetPasswordErrorResponse {
  message: string;
  statusCode: number;
}

export type NewPasswordFormInputs = {
  email: string;
  token: string;
  password: string;
  password_confirm: string;
};
export interface Emargement {
  id: number;
  date: string;
  validate: boolean;
}

export interface Course {
  id: number;
  name: string;
  slot: string;
  classroom: string;
  date_list: DateList[];
  workbook_required: boolean;
}

export interface DateList {
  date: string;
  start_time: string;
  end_time: string;
  session: string;
  validate: boolean;
}
export interface ApiResponse<T> {
  result: T;
}

export interface DeclareAbsencePayload {
  group_id: number;
  date: string;
  student_id: number;
  absence: "PR" | "AP" | "AI" | "AE" | "RJ";
}

export type StudentAbsenceInfo = {
  student_id: number;
  absence: "PR" | "AP" | "AI" | "AE" | "RJ";
};

export interface ValidateEmargementPayload {
  teacher_id: number;
  group_id: number;
  date: string;
  student_list: StudentAbsenceInfo[];
}

export interface Student {
  id: number;
  student_id: number;
  firstname: string;
  lastname: string;
  group_id: number;
}

export interface StudentAttendance {
  id: number;
  name: string;
  absent: boolean;
  motive: string;
  abort: string;
  date: string;
  hour: string;
  evidence: string;
}

export interface GetPresencesResponse {
  status: "fail" | "success";
  error?: "no_request" | "no_student" | string;
  result: Array<{
    id: number;
    name: string;
    absent: boolean;
    motive: string;
    abort: string;
    date: string;
    hour: string;
    evidence: string;
  }>;
}
export interface StudentGroupResponse {
  status: "fail" | "success";
  error?: string;
  result: {
    student_id: number;
    lastname: string;
    firstname: string;
    group_list: Group[];
  };
}
export interface AbandonStatisticsResponse {
  status: "fail" | "success";
  error: string;
  result: {
    abondon?: number;
    session?: string;
    presence_rate?: number;
  };
}

interface DeclareAbsenceSuccessResponse {
  status: "success";
}

interface DeclareAbsenceErrorResponse {
  status: "fail";
  error: string;
}

type DeclareAbsenceResponse =
  | DeclareAbsenceSuccessResponse
  | DeclareAbsenceErrorResponse;

interface ValidateEmargementSuccessResponse {
  status: "success";
}

interface ValidateEmargementErrorResponse {
  status: "fail";
  error: string;
}

type ValidateEmargementResponse =
  | ValidateEmargementSuccessResponse
  | ValidateEmargementErrorResponse;

export interface FlattenedCourse {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  session: string;
  validate: boolean;
  slot: string;
  classroom: string;
  total?: number;
  date: string;
}

export interface LoginResponse {
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LastPresenceApiResponse {
  code: string;
  status: string;
  error?: string;
  result: {
    student_id: number;
    absences: number;
  }[];
}

export interface NextLevelStatusPayload {
  group_id: number;
  student_id: number;
  next_level: "NA" | "Admis" | "Non admis";
  appreciation?: string;
}

export interface NextLevelStatusResponse {
  status: string;
  error?: string;
  result: {
    next_level: "NA" | "Admis" | "Non admis";
    appreciation: string;
  };
}

export type NextLevelStatusUpdate = {
  group_id: number;
  student_id: number;
  next_level: "NA" | "Admis" | "Ajourné";
};

export interface ValidatePassagePayload {
  teacher_id: number;
  group_id: number;
  level_valid: string;
}

export interface ValidatePassageResponse {
  code: string;
  status: string;
  error: string;
  result?: string;
}

export interface UserInfo {
  id: number;
  lastname: string;
  firstname: string;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  univers: string;
}

export interface UserResponse {
  code: string;
  status: string;
  error: string;
  result: {
    adult: {
      access: string;
      info: UserInfo;
    };
    child: {
      access: string;
      info: UserInfo;
    };
  };
}

export interface ValidationResponse {
  status: "fail" | "success";
  error: string;
  result?: {
    abstract_file_name?: string;
    abstract_file_mime?: string;
    abstract_file?: string;
    homework_file_name?: string;
    homework_file_mime?: string;
    homework_file?: string;
  };
}

export interface ValidationPayloadWithFiles {
  group_id: string;
  teacher_id: number;
  date: string;
  abstract: string;
  abstract_file_name?: string;
  abstract_file_mime?: string;
  abstract_file?: string;
  homework: string;
  homework_file_name?: string;
  homework_file_mime?: string;
  homework_file?: string;
}

export interface Workbook {
  id: number;
  workbook_id: number;
  date: string;
  validate: boolean;
  abstract: string;
  homework: string;
  ratio: number;
}

export interface WorkbookListApiResponse {
  status: "success" | "fail";
  error?: string;
  result: Workbook[];
}

export interface Group {
  id: number;
  name: string;
  slot: string;
  session: string;
  classroom?: string;
  level_valid?: string;
  workbook_required?: boolean;
  abstract_required?: boolean;
  liaison_required?: boolean;
  homework_required?: boolean;
}

export interface WorkbookSessionDocument {
  name: string;
  url: string;
  mime?: string;
}

export interface WorkbookSessionInfo {
  id: number;
  date: string;
  validate: boolean;
  homework: string;
  abstract: string;
  abUrlList: WorkbookSessionDocument[];
  hwUrlList: WorkbookSessionDocument[];
}

export interface WorkbookSessionApiResponse {
  code: string;
  status: "fail" | "success";
  error?: string;
  result?: WorkbookSessionInfo | WorkbookSessionInfo[];
}

export interface AddDocumentPayload {
  id: number;
  file_name: string;
  file_mime: string;
  file_type: "ab" | "hw";
  file_content: string;
}

export interface AddDocumentResponse {
  code: string;
  status: "fail" | "success";
  error?: string;
  result: WorkbookSessionInfo[];
}

export interface DeleteDocumentResponse {
  code: string;
  status: "fail" | "success";
  error?: string;
  result: [];
}

export interface DeleteDocumentPayload {
  id: number;
  file_name: string;
  file_type: "ab" | "hw";
}

export interface ValidateAPPayload {
  group_id: number;
  teacher_id: number;
  date: string;
  student_list: {
    student_id: number;
    absence: "AP" | "AI" | "PR";
  }[];
}

interface DateAbsence {
  date: string;
  absence: string;
}
interface DeclareAPPayload {
  group_id: number;
  teacher_id: number;
  student_id: number;
  date_list: DateAbsence[];
}

interface DeclareAPError {
  success: string;
  fail: "no_request" | "no_date" | "no_teacher";
}

interface DeclareAPResponse {
  status: "success" | "fail";
  error: DeclareAPError;
  result: any[];
}

export interface EvalMod {
  _id: ObjectId;
  title: String;
  description: String;
  format: String;
  scale: [ObjectId];
  coef: Number;
  teacherId: [String];
  department: [String];
  delete: Boolean;
}

export interface EvalSheet {
  _id: string;
  groupId: string;
  modId: {
    title: string;
  };
  subject?: string;
  passageDate: Date;
  sendDate?: Date | null;
  statut: string;
  scaleId: string;
  save(): Promise<EvalSheet>;
}

export interface Rating {
  _id: ObjectId;
  evalSheetId: ObjectId;
  studentId: String;
  score: String;
  appreciation: String;
  nc: Boolean;
  studentName: String;
  abs: Boolean;
}

export interface Scale {
  _id: ObjectId;
  type: String;
  start: String;
  end: String;
  min: String;
  max: String;
  qualitativeScaleNames: Array<String>;
  name: String;
  delete: Boolean;
}

export interface WorkbookContentInfoRequest {
  group_id: number;
  teacher_id: number;
  date: string;
  student_id: number;
}

export interface SetWorkbookContentResponse {
  code: string;
  status: "success" | "fail";
  error?: string;
  result: any[];
}

export interface SetWorkbookContentRequest {
  group_id: number;
  date: string;
  teacher_id: number;
  student_id: number;
  liaison: string;
  homework: string;
}

export interface AddWorkbookDocumentRequest {
  liaison_id: number;
  file_name: string;
  file_mime: string;
  file_content: string;
}

export interface AddWorkbookDocumentResponse {
  code: string;
  status: "success" | "fail";
  error?: string;
  result: any[];
}

export interface DeleteWorkbookDocumentPayload {
  liaison_id: number;
  file_name: string;
}

export interface DeleteWorkbookDocumentResponse {
  code: string;
  status: "success" | "fail";
  error?: string;
  result: any[];
}

export interface WorkbookContentValidationResponse {
  status: "success" | "fail";
  error?: "no_request" | "no_teacher" | "no_workbook" | string;
  result: Array<{
    id: number;
    student_id: number;
    lastname: string;
    firstname: string;
    validated_date: string;
    validated: "1" | "0";
  }>;
}

export interface WorkbookContentFile {
  name: string;
  coUrl: string;
}

export interface WorkbookContentInfoResponse {
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

export interface HomeworkStudentListPayload {
  workbook_id: number;
  teacher_id: number;
}

export interface HomeworkStudent {
  id: number;
  student_id: number;
  lastname: string;
  firstname: string;
  validated: "1" | "0";
  validated_date: string;
  docList: Array<{
    name: string;
    stUrl: string;
  }>;
}

export interface HomeworkStudentListResponse {
  code: string;
  status: "success" | "fail";
  error?: string;
  result: HomeworkStudent[];
}

export const getAttendanceList = async (
  groupId: number,
  teacherId: number,
  startDate?: string,
  endDate?: string
): Promise<Attendance[]> => {
  const body = {
    teacher_id: teacherId,
    group_id: groupId,
    ...(startDate && { start_date: startDate }),
    ...(endDate && { end_date: endDate }),
  };

  const response = await BackendApi.post(
    `/teacher/attendance/list/group`,
    body
  );
  if (response.data.status !== "success") {
    throw new Error(response.data.error);
  }
  return response.data.result;
};

export const getGroups = async (teacherId: number) => {
  const response = await BackendApi.post("/teacher/group/list/year", {
    teacher_id: teacherId,
  });
  if (response.data.status !== "success") {
    throw new Error(response.data.error);
  }
  return response.data.result;
};

export const getGroupDatesForMonth = async (
  groupId: number,
  month: string,
  teacherId: number
): Promise<string[]> => {
  const response = await BackendApi.post("/teacher/agenda/group/year", {
    teacher_id: teacherId,
    group_id: groupId,
    month,
  });

  if (response.data.status !== "success") {
    throw new Error(response.data.error);
  }

  const result = response.data.result;

  if (Array.isArray(result)) return [];

  const onlyKeyOfResult = Object.keys(result)[0];
  return result[onlyKeyOfResult] as string[];
};

export const sendRecoveryEmail = async (
  email: string
): Promise<RecoveryResponse> => {
  const response = await BackendApi.post("/reset/password/recovery", { email });
  if (response.data.status !== "success") {
    throw new Error(
      response.data.error ||
        "Une erreur est survenue lors de l'envoi de l'email de récupération."
    );
  }
  return response.data;
};

export const resetPassword = async (
  data: NewPasswordFormInputs
): Promise<ResetPasswordSuccessResponse> => {
  const response = await BackendApi.post("/reset/password/reset", {
    email: data.email,
    token: data.token,
    password: data.password,
    password_confirm: data.password_confirm,
  });

  if (!response.data || response.data.status === "fail") {
    throw new Error(response.data?.error || "Erreur inconnue");
  }

  return response.data;
};

export const getEmargementsNonFaits = async (
  teacherId: number
): Promise<AttendanceApiResponse> => {
  const response = await BackendApi.post<AttendanceApiResponse>(
    "/teacher/attendance/no/validate",
    { teacher_id: teacherId }
  );

  if (response.data.status !== "success") {
    if (response.data.error === "no_attendance") {
      return response.data;
    }

    throw new Error(response.data.error);
  }

  return response.data;
};

export const getNextCourse = async (
  teacherId: number
): Promise<ApiResponse<Course[]>> => {
  const response = await BackendApi.post("/teacher/attendance/incoming", {
    teacher_id: teacherId,
  });
  if (response.data.status !== "success") {
    if (response.data.error === "no_attendance") {
      return response.data;
    }

    throw new Error(response.data.error);
  }
  return response.data;
};

export const searchStudentByName = async (
  studentName: string,
  teacherId: number
) => {
  const response = await BackendApi.post("/teacher/find/student/information", {
    student_name: studentName,
    teacher_id: teacherId,
  });

  if (response.data.status === "fail") {
    throw new Error(response.data.error);
  }

  return response.data.result;
};

export const declareAp = async (
  payload: DeclareAbsencePayload
): Promise<DeclareAbsenceResponse> => {
  const response = await BackendApi.post(
    "/teacher/attendance/set/student",
    payload
  );

  if (response.data.status !== "success") {
    throw new Error(response.data.error);
  }

  return response.data;
};

export const validateFeuilleEmargement = async (
  payload: ValidateEmargementPayload
): Promise<ValidateEmargementResponse> => {
  const response = await BackendApi.post(
    "/teacher/attendance/set/group",
    payload
  );
  if (response.status !== 200 || response.data.status !== "success") {
    throw new Error(
      response.data.error || `Erreur lors de la validation: ${response.data}`
    );
  }
  return response.data;
};

export const getStudentAttendance = async (
  teacherId: number,
  groupId: number,
  date: string
): Promise<StudentAttendance[]> => {
  const response = await BackendApi.post(
    "/teacher/attendance/student/list/group",
    {
      teacher_id: teacherId,
      group_id: groupId,
      date: date,
    }
  );
  if (response.data.status !== "success") {
    throw new Error(response.data.error);
  }
  return response.data.result as StudentAttendance[];
};

export const getDatesList = async (
  groupId: number,
  studentId: number,
  startDate?: string,
  endDate?: string
): Promise<string[]> => {
  const params = {
    group_id: groupId,
    student_id: studentId,
    ...(startDate && { start_date: startDate }),
    ...(endDate && { end_date: endDate }),
  };

  const response = await BackendApi.post(
    `/teacher/attendance/group/student`,
    params
  );

  if (response.data.status !== "success") {
    throw new Error(response.data.error);
  }

  return response.data.result;
};

export const getStudentGroups = async (
  studentId: number,
  teacherId: number
): Promise<StudentGroupResponse> => {
  const response = await BackendApi.post<StudentGroupResponse>(
    "/teacher/find/student/group/list",
    {
      student_id: studentId,
      teacher_id: teacherId,
    }
  );

  if (response.data.status === "fail") {
    throw new Error(
      response.data.error || "An error occurred while fetching groups."
    );
  }

  return response.data;
};

export const getStudents = async (
  groupId: number,
  teacherId: number,
  date?: string
) => {
  const body: {
    teacher_id: number;
    date?: string;
  } = {
    teacher_id: teacherId,
  };

  if (date) {
    body.date = date;
  }

  const response = await BackendApi.post(
    `/teacher/student/list/${groupId}/group`,
    body
  );
  if (response.data.status === "success") {
    return response.data;
  } else {
    throw new Error(response.data.error || "Failed to fetch students.");
  }
};

export const getPresences = async (
  groupId: number,
  date: string,
  teacherId: number
): Promise<GetPresencesResponse> => {
  const response = await BackendApi.post<GetPresencesResponse>(
    "/teacher/attendance/student/list/group",
    {
      group_id: groupId,
      date,
      teacher_id: teacherId,
    }
  );

  if (response.data.status === "fail") {
    throw new Error(response.data.error || "Une erreur est survenue");
  }

  return response.data;
};
export const getAbandonStatistics = async (
  groupId: number,
  teacherId: number
): Promise<AbandonStatisticsResponse> => {
  try {
    const response = await BackendApi.post("/teacher/group/abandon", {
      group_id: groupId,
      teacher_id: teacherId,
    });
    if (response.status !== 200)
      throw new Error("Network response was not ok.");
    return response.data;
  } catch (error) {
    throw new Error("Fetching abandon statistics failed");
  }
};

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await BackendApi.post("login_check", credentials);

  if (response.status !== 200) {
    throw new Error("Échec de la connexion");
  }

  return response.data;
};

export const fetchLastPresence = async (
  teacherId: number,
  groupId: number
): Promise<LastPresenceApiResponse> => {
  const response = await BackendApi.post<LastPresenceApiResponse>(
    "/teacher/find/student/last/absence",
    {
      teacher_id: teacherId,
      group_id: groupId,
    }
  );

  if (response.status !== 200 || response.data.status === "fail") {
    throw new Error(
      response.data?.error ||
        "Erreur lors de la récupération de la dernière présence"
    );
  }

  return response.data;
};

export const postNextLevelStatus = async (
  payload: NextLevelStatusPayload
): Promise<NextLevelStatusResponse> => {
  const response = await BackendApi.post<NextLevelStatusResponse>(
    `/teacher/student/next/level`,
    payload
  );

  if (response.data.status !== "success") {
    throw new Error(
      response.data.error ||
        "Erreur lors de la définition du statut d'avis de passage."
    );
  }

  return response.data;
};

export const validatePassageApi = async (
  payload: ValidatePassagePayload
): Promise<ValidatePassageResponse> => {
  try {
    const response = await BackendApi.post<ValidatePassageResponse>(
      "/teacher/group/next/level",
      payload
    );
    if (!response || response.status !== 200) {
      throw new Error("Error validating passage");
    }
    return response.data;
  } catch (error) {
    throw new Error("Network or server error");
  }
};

export const getUserInfo = async (login: string): Promise<UserResponse> => {
  const timestamp = new Date().getTime();

  const response = await BackendApi.post<UserResponse>("/teacher/information", {
    login,
    _cache_buster: timestamp,
  });
  return response.data;
};

export const validateCahierSeance = async (
  payload: ValidationPayloadWithFiles
): Promise<ValidationResponse> => {
  const response = await BackendApi.post(
    "/teacher/workbook/set/group",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status !== 200 || response.data.status !== "success") {
    throw new Error(
      `Erreur de validation : ${response.data.error || response.statusText}`
    );
  }

  return response.data;
};

export const getWorkbookList = async (
  groupId: number,
  teacherId: number,
  startDate: string,
  endDate: string
): Promise<WorkbookListApiResponse> => {
  const response = await BackendApi.post<WorkbookListApiResponse>(
    "/teacher/workbook/list/group",
    {
      group_id: groupId,
      teacher_id: teacherId,
      start_date: startDate,
      end_date: endDate,
    }
  );

  if (response.data.status !== "success") {
    throw new Error(response.data.error || "Failed to fetch workbooks.");
  }

  return response.data;
};

export const fetchWorkbookSessionInfo = async (
  teacherId: number,
  groupId: number,
  date: string
): Promise<WorkbookSessionApiResponse> => {
  const response = await BackendApi.post<WorkbookSessionApiResponse>(
    "/teacher/workbook/group/info",
    {
      teacher_id: teacherId,
      group_id: groupId,
      date,
    }
  );

  console.log("Réponse API dans fetchWorkbookSessionInfo :", response.data);

  if (response.data.status !== "success") {
    throw new Error(response.data.error || "Erreur API");
  }

  return response.data;
};

export const addDocumentToWorkbook = async (
  payload: AddDocumentPayload
): Promise<AddDocumentResponse> => {
  try {
    console.log("Envoi d'un document au serveur:", {
      id: payload.id,
      file_name: payload.file_name,
      file_type: payload.file_type,
      file_mime: payload.file_mime,
      file_content_length: payload.file_content
        ? payload.file_content.length
        : 0,
    });

    const response = await BackendApi.post<AddDocumentResponse>(
      "/teacher/workbook/document/new",
      payload
    );

    console.log("Réponse brute de l'API d'ajout de document:", response.data);

    if (!response.data) {
      throw new Error("Réponse API vide");
    }

    if (response.data.status !== "success") {
      throw new Error(
        response.data.error || "Erreur lors de l'ajout du document."
      );
    }

    if (!response.data.result) {
      response.data.result = [];
    }

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du document:", error);
    throw error;
  }
};

export const deleteDocument = async (
  payload: DeleteDocumentPayload
): Promise<DeleteDocumentResponse> => {
  console.log("Envoi de requête de suppression:", payload);

  try {
    const response = await BackendApi.post<DeleteDocumentResponse>(
      "/teacher/workbook/document/delete",
      payload
    );

    console.log("Réponse brute de suppression:", response.data);

    if (response.data.status !== "success") {
      throw new Error(
        response.data.error || "Erreur lors de la suppression du document."
      );
    }

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la requête de suppression:", error);
    throw error;
  }
};
/*
export const validateAP = async (
  payload: ValidateAPPayload
): Promise<DeclareAbsenceResponse> => {
  const response = await BackendApi.post<DeclareAbsenceResponse>(
    "/teacher/attendance/prepare/group",
    payload
  );

  if (response.data.status !== "success") {
    throw new Error(
      response.data.error ||
        "Erreur lors de la validation de l'absence prévue (AP)."
    );
  }

  return response.data;
};
*/

export const declareStudentAP = async (
  payload: DeclareAPPayload
): Promise<DeclareAPResponse> => {
  const response = await BackendApi.post<DeclareAPResponse>(
    "/teacher/attendance/prepare/student",
    payload
  );

  if (response.data.status !== "success") {
    throw new Error(
      response.data.error?.fail ||
        "Erreur lors de la déclaration de l'absence prévue"
    );
  }

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

export const getWorkbookContentInfo = async (
  params: WorkbookContentInfoRequest
): Promise<WorkbookContentInfoResponse> => {
  const response = await BackendApi.post<WorkbookContentInfoResponse>(
    "/teacher/workbook/content/info",
    params
  );

  if (response.data.status !== "success") {
    throw new Error(
      response.data.error ||
        "Erreur lors de la récupération de la correspondance"
    );
  }

  return response.data;
};

export const setWorkbookContent = async (
  params: SetWorkbookContentRequest
): Promise<SetWorkbookContentResponse> => {
  const response = await BackendApi.post<SetWorkbookContentResponse>(
    "/teacher/workbook/content/set",
    params
  );

  if (response.data.status !== "success") {
    throw new Error(
      response.data.error ||
        "Erreur lors de la modification de la correspondance"
    );
  }

  return response.data;
};

export const addWorkbookDocument = async (
  params: AddWorkbookDocumentRequest
): Promise<AddWorkbookDocumentResponse> => {
  const response = await BackendApi.post<AddWorkbookDocumentResponse>(
    "/teacher/workbook/content/document/new",
    params
  );

  if (response.data.status !== "success") {
    throw new Error(
      response.data.error ||
        "Erreur lors de l'ajout du document à la correspondance"
    );
  }

  return response.data;
};

export const deleteWorkbookDocument = async (
  params: DeleteWorkbookDocumentPayload
): Promise<DeleteWorkbookDocumentResponse> => {
  const response = await BackendApi.post<DeleteWorkbookDocumentResponse>(
    "/teacher/workbook/content/document/delete",
    params
  );

  if (response.data.status !== "success") {
    throw new Error(
      response.data.error ||
        "Erreur lors de la suppression du document de la correspondance"
    );
  }

  return response.data;
};

export const getWorkbookContentValidations = async (
  groupId: number,
  teacherId: number,
  date: string
): Promise<WorkbookContentValidationResponse> => {
  const response = await BackendApi.post<WorkbookContentValidationResponse>(
    "/teacher/workbook/content/list/group",
    {
      group_id: groupId,
      teacher_id: teacherId,
      date: date,
    }
  );

  if (response.data.status !== "success") {
    throw new Error(
      response.data.error || "Erreur lors de la récupération des validations"
    );
  }

  return response.data;
};

export const getHomeworkStudentList = async (
  workbookId: number,
  teacherId: number
): Promise<HomeworkStudentListResponse> => {
  try {
    const payload: HomeworkStudentListPayload = {
      workbook_id: workbookId,
      teacher_id: teacherId,
    };

    const response = await BackendApi.post<HomeworkStudentListResponse>(
      "/teacher/workbook/student/list",
      payload
    );

    if (!response.data) {
      throw new Error("Réponse API vide");
    }

    if (response.data.status !== "success") {
      throw new Error(
        response.data.error ||
          "Erreur lors de la récupération de la liste des étudiants du devoir"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des étudiants du devoir:",
      error
    );
    throw error;
  }
};
