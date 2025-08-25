"use client";

import useGroup from "@/hooks/useGroup";
import { useSearchParams } from "next/navigation";
import EvaluationHeader from "@/components/EvaluationHeader";
import { displayDate, formatSlotWithDayAndTime } from "@/lib/dates";
import clsx from "clsx";
import { Student } from "@/components/FeuilleEmargement";
import { useTeacher } from "@/app/TeacherContext";
import { useLastPresence } from "@/components/FeuilleEmargement";
import { useRouter } from "next/navigation";

const StudentsListPage = () => {
  const search = useSearchParams();
  const router = useRouter();
  const groupId = Number(search.get("groupId"));
  const groupName = search.get("groupName");
  const groupSlot = search.get("groupSlot");

  const handleStudentClick = (student: Student) => {
    if (!groupName || !groupSlot) return;

    router.push(
      `evaluations-list?groupId=${groupId}&groupName=${encodeURIComponent(
        groupName
      )}&groupSlot=${encodeURIComponent(groupSlot)}&studentId=${
        student.id
      }&studentName=${encodeURIComponent(student.name)}`
    );
  };

  const { teacherId } = useTeacher();
  const { data: lastPresenceData } = useLastPresence(teacherId, groupId);

  const { allStudents, groupsStatistics, getStudentStatistics } = useGroup({
    date: "",
    groupId,
  });

  if (!groupId) return <p>Veuillez spécifier un groupe et une date</p>;

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden md:hidden">
      <div className="px-6 py-4">
        <EvaluationHeader title="Feuille d’évaluation" />
      </div>
      {groupName && groupSlot && (
        <div>
          <h1 className="text-xl font-bold text-center">{groupName}</h1>
          <p className="text-md font-semibold text-center">
            {formatSlotWithDayAndTime(groupSlot)}
          </p>
        </div>
      )}
      <div className="flex flex-col gap-2 p-5 min-h-[33%] max-h-[72%] grow overflow-y-auto">
        {[...allStudents]
          .sort((a, b) => {
            const aAbandoned = a.abort && a.abort !== "0";
            const bAbandoned = b.abort && b.abort !== "0";
            return Number(aAbandoned) - Number(bAbandoned);
          })
          .map((student: Student) => {
            const isAbandoned = student.abort && student.abort !== "0";
            return (
              <div
                key={student.id}
                onClick={() => handleStudentClick(student)}
                className={clsx(
                  "flex flex-row shadow-md rounded-2xl justify-between h-[4.5rem]",
                  isAbandoned ? "bg-gray-200" : "bg-white"
                )}
              >
                <div className="flex items-center w-full">
                  {isAbandoned ? (
                    <div className="rounded-l-2xl h-[4.5rem] flex items-center justify-center bg-gray-300 w-[3rem]">
                      <p className="text-transparent text-center text-md font-semibold p-2">
                        abd
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-l-2xl h-full flex items-center justify-center bg-shatibi-orange w-[3rem]">
                      <p className="text-white text-center text-md font-semibold p-2">
                        {getStudentStatistics(student.id).totalAbsences}
                        <br />
                        Abs
                      </p>
                    </div>
                  )}
                  <div className="pl-3 flex flex-col justify-center h-full">
                    <p className="text-[0.875rem] font-semibold">
                      {student.name}
                    </p>
                    {isAbandoned ? (
                      <p className="text-xs font-normal">
                        Abandon depuis&nbsp;
                        <span className="text-black font-semibold">
                          {displayDate(student.abort)}
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs font-normal">
                        {(() => {
                          const absences = lastPresenceData?.result.find(
                            (s) => s.student_id === student.id
                          )?.absences;

                          if (absences === 0)
                            return "Présent à la dernière séance";
                          if (absences === 1)
                            return "Absent à la dernière séance";
                          if (absences && absences > 1) {
                            return (
                              <>
                                Absent depuis
                                <span className="text-black font-semibold">
                                  {` ${absences} séances`}
                                </span>
                              </>
                            );
                          }
                          return null;
                        })()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default StudentsListPage;
