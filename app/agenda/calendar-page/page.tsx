"use client";

import { useState } from "react";
import CalendarComponent, {
  DayHighlight,
  computeColorHexFromString,
} from "@/components/Calendar";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  formatDayToThreeLetters,
  parseDateFromString,
  sortGroupsByDayAndTime,
} from "@/lib/dates";
import { QUERY_KEY } from "@/lib/queries";
import { Group, getGroupDatesForMonth, getGroups } from "@/api";
import { useTeacher } from "@/app/TeacherContext";
import FloatingMenu from "@/components/FloatingMenu";
import SectionTitle from "@/components/SectionTitle";
import BottomMenu from "@/components/BottomMenu";

/** @ref https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_uniqwith */
function uniqWith<T>(arr: T[], comparator: (a: T, b: T) => boolean): T[] {
  return arr.filter(
    (element, index, self) =>
      self.findIndex((e) => comparator(element, e)) === index
  );
}

const CalendarPage = () => {
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>(
    (new Date().getMonth() + 1).toString().padStart(2, "0")
  );
  const handleMonthChange = (date: Date) => {
    const newMonth = date.getMonth() + 1;
    setCurrentMonth(newMonth.toString().padStart(2, "0"));
  };
  const { teacherId } = useTeacher();

  const handleClick = (groupId: number) => {
    setSelectedGroupIds((prevSelectedGroupIds) => {
      if (prevSelectedGroupIds.includes(groupId)) {
        return prevSelectedGroupIds.filter((id) => id !== groupId);
      } else {
        return [...prevSelectedGroupIds, groupId];
      }
    });
  };

  const {
    data: groups = [],
    isLoading,
    isError,
    error,
  } = useQuery<Group[], Error>({
    queryKey: [QUERY_KEY.GROUPS, teacherId],
    queryFn: () => {
      if (teacherId !== null) {
        return getGroups(teacherId);
      } else {
        throw new Error("teacherId is null");
      }
    },
    enabled: teacherId !== null,
  });

  const groupDateQueries =
    groups?.map((group) => ({
      queryKey: [QUERY_KEY.GROUP_DATES, group.id, currentMonth, teacherId],
      queryFn: () => {
        if (!teacherId) {
          throw new Error("Teacher ID is required to fetch group dates");
        }
        return getGroupDatesForMonth(group.id, currentMonth, teacherId);
      },
      enabled: !!teacherId && !!group.id && !!currentMonth,
    })) ?? [];

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

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError || results.some((query) => query.isError)) {
    return (
      <div>
        Erreur:{" "}
        {error?.message || "Erreur lors de la récupération des données."}
      </div>
    );
  }

  const sortedGroups = groups ? sortGroupsByDayAndTime(groups) : [];

  return (
    <div className="h-dvh flex flex-col gap-4 relative overflow-hidden md:hidden">
      <FloatingMenu />

      <div className="flex flex-col h-full">
        <div className="pt-3">
          <SectionTitle title="Mon agenda" />
        </div>
        <div className="mt-8">
          <CalendarComponent
            groups={groups}
            daysToHighlight={formattedDaysToHighlight}
            selectedGroupIds={selectedGroupIds}
            onMonthChange={handleMonthChange}
          />
        </div>

        <div className="flex flex-col gap-y-1 items-center w-full py-1 border-t border-gray-200 flex-1 min-h-0">
          <div className="overflow-y-auto w-full max-h-40">
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
        </div>

        <div className="h-8"></div>
      </div>
      <BottomMenu />
    </div>
  );
};

export default CalendarPage;
