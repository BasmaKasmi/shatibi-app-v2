"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueries, useQuery } from "@tanstack/react-query";
import BottomMenuStudent from "@/components/BottomMenuStudent";
import SectionTitle from "@/components/SectionTitle";
import StudentCalendarComponent, {
  DayHighlight,
} from "@/components/StudentCalendar";
import { getStudentsGroups, getStudentDatesForMonth } from "@/lib/student-api";
import { QUERY_KEY } from "@/lib/queries";
import {
  parseDateFromString,
  formatDayToThreeLetters,
  sortGroupsByDayAndTime,
} from "@/lib/dates";
import { computeColorHexFromString } from "@/components/Calendar";
import FloatingMenu from "@/components/FloatingMenu";
import StudentRouteGuard from "@/components/StudentRouteGuard";

function uniqWith<T>(arr: T[], comparator: (a: T, b: T) => boolean): T[] {
  return arr.filter(
    (element, index, self) =>
      self.findIndex((e) => comparator(element, e)) === index
  );
}

const CalendarStudent = () => {
  const router = useRouter();
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>(
    (new Date().getMonth() + 1).toString().padStart(2, "0")
  );
  const [studentId, setStudentId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleClick = (groupId: number) => {
    setSelectedGroupIds((prevSelectedGroupIds) => {
      if (prevSelectedGroupIds.includes(groupId)) {
        return prevSelectedGroupIds.filter((id) => id !== groupId);
      } else {
        return [...prevSelectedGroupIds, groupId];
      }
    });
  };

  useEffect(() => {
    const storedStudentId = localStorage.getItem("student_id");
    const storedToken = localStorage.getItem("token");
    if (storedStudentId && storedToken) {
      setStudentId(Number(storedStudentId));
      setToken(storedToken);
    } else {
      router.push("/student-login");
    }
  }, [router]);

  const handleMonthChange = (date: Date) => {
    const newMonth = date.getMonth() + 1;
    setCurrentMonth(newMonth.toString().padStart(2, "0"));
  };

  const {
    data: groupsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QUERY_KEY.STUDENTS_GROUPS, studentId],
    queryFn: async () => {
      if (!studentId || !token) {
        throw new Error("Student ID et token sont requis");
      }
      return getStudentsGroups(studentId, token);
    },
    enabled: !!studentId && !!token,
  });

  const groups = groupsData?.result?.group_list || [];
  const sortedGroups = groups ? sortGroupsByDayAndTime(groups) : [];

  const groupDateQueries = groups.map((group) => ({
    queryKey: [QUERY_KEY.GROUP_DATES, group.id, currentMonth, studentId],
    queryFn: () => {
      if (!studentId || !token) {
        throw new Error("Student ID et token sont requis");
      }
      return getStudentDatesForMonth(group.id, currentMonth, studentId, token);
    },
    enabled: !!studentId && !!token && !!group.id && !!currentMonth,
  }));

  const results = useQueries({ queries: groupDateQueries });

  let formattedDaysToHighlight = results
    .map((result: { data?: string[] }, index: number) =>
      (result.data ?? []).map((dateAsString: string) => ({
        groupId: groups[index].id,
        date: parseDateFromString(dateAsString),
      }))
    )
    .flat();

  formattedDaysToHighlight = uniqWith<DayHighlight>(
    formattedDaysToHighlight,
    (a, b) => a.groupId === b.groupId && a.date.getTime() === b.date.getTime()
  );

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;

  return (
    <StudentRouteGuard>
      <div className="h-dvh flex flex-col gap-4 relative overflow-hidden md:hidden">
        <div className="flex flex-col h-full">
          <FloatingMenu />

          <div className="pt-3">
            <SectionTitle title="Mon agenda" />
          </div>
          <div className="mt-8">
            <StudentCalendarComponent
              groups={groups}
              daysToHighlight={formattedDaysToHighlight}
              selectedGroupIds={selectedGroupIds}
              onMonthChange={handleMonthChange}
            />
          </div>

          <div className="flex flex-col mt-3 items-center overflow-y-auto w-full py-1 ">
            {sortedGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => handleClick(group.id)}
                className={`px-6 py-2 shadow-md rounded-lg w-11/12 mx-auto mb-2
                ${
                  selectedGroupIds.includes(group.id)
                    ? "bg-shatibi-orange text-white"
                    : "bg-white"
                }`}
              >
                <div className="flex flex-row items-center flex-grow justify-between">
                  <p
                    className={`text-[14px] font-semibold ${
                      selectedGroupIds.includes(group.id)
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {group.name || "Nom du cours indisponible"}
                  </p>

                  <span
                    className="inline-block h-4 w-4 rounded-full"
                    style={{
                      backgroundColor: computeColorHexFromString(
                        Number(group.id)
                      ),
                    }}
                  ></span>
                </div>
                <p className="text-xs font-light">
                  {formatDayToThreeLetters(group.slot)}
                </p>
              </div>
            ))}
          </div>

          <BottomMenuStudent />
        </div>
      </div>
    </StudentRouteGuard>
  );
};

export default CalendarStudent;
