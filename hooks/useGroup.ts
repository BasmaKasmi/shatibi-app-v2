import { getAbandonStatistics, getPresences, getStudents } from "@/api/index";
import { useTeacher } from "@/app/TeacherContext";
import { QUERY_KEY } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export const getStudentsForDayQueryKey = (groupId: number, date: string) => [
  QUERY_KEY.GROUP_STUDENTS,
  groupId,
  date,
];

export const useGroup = ({
  groupId,
  date,
}: {
  groupId: number;
  date: string;
}) => {
  const { teacherId, setTeacherId } = useTeacher();

  const {
    data: abandonData,
    isLoading: isLoadingAbandon,
    error: abandonError,
  } = useQuery({
    queryKey: [QUERY_KEY.ABANDON_STATISTICS, groupId, teacherId],
    queryFn: () =>
      teacherId
        ? getAbandonStatistics(groupId, teacherId)
        : Promise.reject(new Error("Teacher ID is missing")),
    enabled: !!teacherId,
  });

  const { data: studentsDataForDate, isLoading: isLoadingForDate } = useQuery({
    queryKey: [QUERY_KEY.GROUP_STUDENTS, groupId, date, teacherId],
    queryFn: () =>
      teacherId
        ? getPresences(groupId, date, teacherId)
        : Promise.reject(new Error("Teacher ID is missing")),
    enabled: !!teacherId,
  });

  const { data: studentsData, isLoading } = useQuery({
    queryKey: [QUERY_KEY.GROUP_STUDENTS, groupId, teacherId],
    queryFn: () =>
      teacherId
        ? getStudents(groupId, teacherId)
        : Promise.reject(new Error("Teacher ID is missing")),
    enabled: !!teacherId,
  });

  const getTotalAbsences = (studentId: number) => {
    try {
      return ASSIDUITE_MAPPING[studentId].totalAbsences;
    } catch {
      return 0;
    }
  };

  const studentPercentage = (
    studentId: number,
    studentAbsences: number,
    session: string
  ): number => {
    const [, totalSessions] = session.split("/").map(Number);
    const presenceSessions = totalSessions - studentAbsences;

    if (totalSessions === 0) return 0;

    const presencePercentage = (presenceSessions / totalSessions) * 100;
    const roundedPercentage = Math.round(presencePercentage);

    return roundedPercentage;
  };

  const allStudents = studentsData?.result ?? [];
  const students = studentsDataForDate?.result ?? [];
  const studentsForDate = [...students];

  const ASSIDUITE_MAPPING = Object.fromEntries(
    allStudents.map((student: any) => {
      const totalAbsences =
        Number(student.nb_ap ?? 0) + Number(student.nb_ai ?? 0);
      const percentage = studentPercentage(
        student.id,
        totalAbsences,
        abandonData?.result.session ?? "0/0"
      );
      return [
        student.id,
        {
          ...student,
          totalAbsences,
          ai: Number(student.nb_ai),
          ap: Number(student.nb_ap),
          presencePercentage: percentage,
        },
      ];
    })
  );

  const getStudentStatistics = (studentId: number) => {
    try {
      return ASSIDUITE_MAPPING[studentId];
    } catch {
      return {};
    }
  };

  const statistics = {
    inscrits: studentsForDate.length,
    abandons: abandonData?.result.abondon ?? 0,
    presence: abandonData?.result.presence_rate ?? 0,
    session: abandonData?.result.session ?? "",
  };
  const groupsStatistics = {
    inscrits: allStudents.length,
    abandons: abandonData?.result.abondon ?? 0,
    presence: abandonData?.result.presence_rate ?? 0,
    session: abandonData?.result.session ?? "",
  };

  return {
    isLoading,
    allStudents,
    groupsStatistics,
    students,
    studentsForDate,
    isLoadingForDate,
    isLoadingAbandon,
    abandonError,
    getTotalAbsences,
    statistics,
    getStudentStatistics,
  };
};

export default useGroup;
