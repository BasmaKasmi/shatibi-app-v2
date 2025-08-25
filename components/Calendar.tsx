"use client";

import React from "react";
import { Calendar } from "@mantine/dates";
import "@mantine/dates/styles.css";
import Image from "next/image";
import {
  formatWeekday,
  getDayOfTheWeek,
  getWeekdayFromDatabaseDayString,
  isSameDay,
} from "@/lib/dates";
import { Group } from "@/api/index";

export interface DayHighlight {
  date: Date;
  groupId: number;
}

interface CalendarComponentProps {
  daysToHighlight: DayHighlight[];
  selectedGroupIds: number[];
  onMonthChange: (date: Date) => void;
  groups: Group[];
}

type ColorCache = {
  [groupId: string]: string;
};

const groupColorCache: ColorCache = {};

/** https://stackoverflow.com/a/20129594/11348232 */
export function computeColorHexFromString(stringValue: number): string {
  const hue = stringValue * 137.508;
  const s = stringValue % 100;
  return `hsl(${hue}, ${s}%, ${100 - s}%)`;
}

const DAYS_IN_DB = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

const getDaysOfWeekAsNumberFromSlot = (g: Group) => {
  const days = [];

  for (const d of DAYS_IN_DB) {
    if (g.slot.includes(d)) {
      days.push(d);
    }
  }

  return days.map(getWeekdayFromDatabaseDayString);
};

const CalendarComponent = ({
  daysToHighlight,
  selectedGroupIds,
  onMonthChange,
  groups,
}: CalendarComponentProps) => {
  const renderDay = (date: Date) => {
    const highlightedDay = daysToHighlight.find(
      (d) =>
        isSameDay(d.date, date) &&
        (selectedGroupIds.length === 0 || selectedGroupIds.includes(d.groupId))
    );

    const groupIdsThatHaveCourseThisDayOfTheWeekAndAreSelected = groups
      .filter((g) =>
        getDaysOfWeekAsNumberFromSlot(g).includes(getDayOfTheWeek(date))
      )
      .filter(
        (g) => selectedGroupIds.includes(g.id) || selectedGroupIds.length === 0
      )
      .map((g) => g.id);

    const background =
      groupIdsThatHaveCourseThisDayOfTheWeekAndAreSelected.length === 0
        ? "transparent"
        : groupIdsThatHaveCourseThisDayOfTheWeekAndAreSelected.length === 1
        ? computeColorHexFromString(
            groupIdsThatHaveCourseThisDayOfTheWeekAndAreSelected[0]
          )
        : `linear-gradient(90deg, ${computeColorHexFromString(
            groupIdsThatHaveCourseThisDayOfTheWeekAndAreSelected[0]
          )} 50%, ${computeColorHexFromString(
            groupIdsThatHaveCourseThisDayOfTheWeekAndAreSelected[1]
          )} 50%)`;

    if (highlightedDay) {
      return (
        <div
          style={{
            background,
          }}
          className="rounded-full font-extrabold -pl-2 shadow-2xl text-white p-4 w-2 h-2 flex items-center justify-center text-center"
        >
          <p className="w-fit">{highlightedDay.date.getDate()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-6 flex items-center justify-center w-full">
      <Calendar
        styles={{
          calendarHeader: {
            paddingInline: "1rem",
            marginLeft: "auto",
            marginRight: "auto",
          },
          weekday: {
            color: "#5F5F5F",
            fontWeight: "bolder",
            fontSize: "1.1rem",
          },
          day: {
            color: "black",
            fontWeight: "normal",
            fontSize: "1.1rem",
            margin: "0.25rem",
          },
          calendarHeaderLevel: {
            fontWeight: "700",
            fontSize: "1.2rem",
          },
        }}
        onNextMonth={onMonthChange}
        onPreviousMonth={onMonthChange}
        nextIcon={
          <Image
            src="/assets/previous-icon.svg"
            alt="next"
            width={32}
            height={32}
            className="rotate-180"
          />
        }
        previousIcon={
          <Image
            src="/assets/previous-icon.svg"
            alt="previous"
            width={32}
            height={32}
          />
        }
        firstDayOfWeek={1}
        weekdayFormat={formatWeekday}
        renderDay={renderDay}
      />
    </div>
  );
};

export default CalendarComponent;
