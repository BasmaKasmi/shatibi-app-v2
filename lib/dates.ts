import "dayjs/locale/fr";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekday from "dayjs/plugin/weekday";
import dayjs from "dayjs";
import { Group } from "@/api/index";

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.locale("fr");

const capitalize = (s: string) =>
  s.length === 0 ? "" : s[0].toUpperCase() + s.slice(1);

export const parseDateFromString = (dateAsString: string) =>
  dayjs(dateAsString, "YYYY-MM-DD").toDate();

export const displayDate = (dateAsString: string) =>
  dayjs(dateAsString, "YYYY-MM-DD").format("DD/MM/YYYY");

export const displayFullDate = (dateAsString: string) =>
  capitalize(dayjs(dateAsString, "YYYY-MM-DD").format("ddd DD MMM YYYY"));

export const convertSlotToDateString = (slot: string): string => {
  const dayAbbrev = slot.substring(0, 2);

  const today = new Date();

  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? 1 : 1 - currentDay;
  const mondayOfCurrentWeek = new Date(today);
  mondayOfCurrentWeek.setDate(today.getDate() + mondayOffset);

  const targetDay = getWeekdayFromDatabaseDayString(dayAbbrev);

  const targetDate = new Date(mondayOfCurrentWeek);
  targetDate.setDate(mondayOfCurrentWeek.getDate() + targetDay);

  return targetDate.toISOString().split("T")[0];
};
export const TitleDate = (dateAsString: string) =>
  capitalize(
    dayjs(dateAsString, "YYYY-MM-DD").format("ddd DD MMM").replace(".", "")
  );

export const displayToday = () =>
  capitalize(dayjs().format("dddd D MMMM YYYY"));

export const isSameDay = (dateA: Date, dateB: Date) =>
  dayjs(dateA).format("DD MMM YYYY") === dayjs(dateB).format("DD MMM YYYY");

export const formatWeekday = (date: Date) => {
  const weekday = dayjs(date).format("dddd");
  if (weekday === "mercredi") return "Me";
  return weekday.charAt(0).toUpperCase();
};

export const formatDayToThreeLetters = (slot: string): string => {
  const daysMap: { [key: string]: string } = {
    Lu: "Lun",
    Ma: "Mar",
    Me: "Mer",
    Je: "Jeu",
    Ve: "Ven",
    Sa: "Sam",
    Di: "Dim",
  };

  if (slot.match(/^(vendredi|Ve)/i)) {
    return "Ven" + slot.replace(/^(vendredi|Ve)/i, "");
  }
  if (slot.match(/^(mardi|Ma)/i)) {
    return "Mar" + slot.replace(/^(mardi|Ma)/i, "");
  }
  if (slot.match(/^(jeudi|Je)/i)) {
    return "Jeu" + slot.replace(/^(jeudi|Je)/i, "");
  }

  const dayAbbreviation = slot.substring(0, 2);
  const dayInThreeLetters = daysMap[dayAbbreviation];
  const timeSlot = slot.substring(2);

  return `${dayInThreeLetters || "Err"}${timeSlot}`;
};

export const getDayOfTheWeek = (date: Date) => dayjs(date).weekday();

export const getWeekdayFromDatabaseDayString = (ds: string): number => {
  switch (ds) {
    case "Lu":
      return 0;
    case "Ma":
      return 1;
    case "Me":
      return 2;
    case "Je":
      return 3;
    case "Ve":
      return 4;
    case "Sa":
      return 5;
    case "Di":
      return 6;
    default:
      throw "unknown day: " + ds;
  }
};

export const formatSlotWithDayAndTime = (slot: string): string => {
  const daysMap: { [key: string]: string } = {
    Lu: "Lundi",
    Ma: "Mardi",
    Me: "Mercredi",
    Je: "Jeudi",
    Ve: "Vendredi",
    Sa: "Samedi",
    Di: "Dimanche",
  };

  const timeRegex = /(\d{2}h\d{2})\s?[-]?\s?(\d{2}h\d{2})/;
  const match = timeRegex.exec(slot);

  if (match) {
    const [, startTime, endTime] = match;
    const dayAbbreviation = slot.substring(0, 2);
    const dayFullName = daysMap[dayAbbreviation];

    if (dayFullName) {
      return `${dayFullName} de ${startTime} à ${endTime}`;
    }
  }

  return "Format incorrect";
};

export const extractTimeFromSlot = (slot: string): string => {
  const timeRegex = /(\d{2}h\d{0,2})\s?[-à]\s?(\d{2}h\d{0,2})/;
  const match = timeRegex.exec(slot);

  if (match) {
    const [, startTime, endTime] = match;
    return `de ${startTime} à ${endTime}`;
  }

  return "Horaires non disponibles";
};

const daySortOrder: { [key: string]: number } = {
  Lun: 1,
  Mar: 2,
  Mer: 3,
  Jeu: 4,
  Ven: 5,
  Sam: 6,
  Dim: 7,
};

export function sortGroupsByDayAndTime(groups: Group[]): Group[] {
  return groups.sort((a, b) => {
    const dayA = formatDayToThreeLetters(a.slot).substring(0, 3);
    const startTimeA = extractStartTime(a.slot);

    const dayB = formatDayToThreeLetters(b.slot).substring(0, 3);
    const startTimeB = extractStartTime(b.slot);

    const dayComparison = (daySortOrder[dayA] || 0) - (daySortOrder[dayB] || 0);
    if (dayComparison !== 0) return dayComparison;

    return startTimeA.localeCompare(startTimeB);
  });
}

function extractStartTime(slot: string): string {
  const matches = slot.match(/\d{2}h\d{2}/);
  return matches ? matches[0] : "";
}

export const formatDate = (date: Date): string =>
  dayjs(date).format("YYYY-MM-DD");

export const daysMapping = {
  Lu: "Lundi",
  Ma: "Mardi",
  Me: "Mercredi",
  Je: "Jeudi",
  Ve: "Vendredi",
  Sa: "Samedi",
  Di: "Dimanche",
};

export const today = displayToday();
export const todayDay = today.split(" ")[0];

export const getForcedWednesday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilWednesday = (3 - dayOfWeek + 7) % 7;
  const nextWednesday = new Date(today);
  nextWednesday.setDate(today.getDate() + daysUntilWednesday);
  return nextWednesday;
};

export function formatTitle(fullTitle: string | null) {
  if (!fullTitle) return { title: "", dateTime: "" };

  const parts = fullTitle.split(" - ");
  return {
    title: parts[0],
    dateTime: parts[1] || "",
  };
}

export const evidenceDate = (dateAsString: string | undefined) => {
  if (!dateAsString) return "";

  const monthMap: { [key: string]: string } = {
    janv: "Jan",
    févr: "Fev",
    mars: "Mar",
    avri: "Avr",
    mai: "Mai",
    juin: "Jun",
    juil: "Jul",
    août: "Aou",
    sept: "Sep",
    octo: "Oct",
    nove: "Nov",
    déce: "Dec",
  };

  const rawDate = dayjs(dateAsString).locale("fr").format("DD MMM YYYY");

  return rawDate.replace(/([a-zé]{4,})[.]?/i, (match) => {
    const month = monthMap[match.toLowerCase()] || match.substring(0, 3);
    return month + ".";
  });
};

export const reformatSlot = (slot: string): string => {
  const dayAbbrev = slot.substring(0, 2);
  const fullDay = daysMapping[dayAbbrev as keyof typeof daysMapping] || "";

  const timeMatch = slot.match(/(\d{2}h\d{2})\s*[-]\s*(\d{2}h\d{2})/);
  if (!timeMatch) return slot;

  const [, startTime, endTime] = timeMatch;
  return `${fullDay} de ${startTime} à ${endTime}`;
};

export const formatDateWithWeekday = (dateString: string) => {
  let date;
  if (dateString.includes("-")) {
    date = dayjs(dateString, "YYYY-MM-DD");
  } else {
    date = dayjs(dateString, "DD/MM/YYYY");
  }

  return capitalize(date.format("dddd DD/MM/YYYY"));
};

export const formatDateFrench = (dateString: string): string => {
  const date = new Date(dateString);

  const daysOfWeek = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${dayOfWeek} ${day}/${month}/${year}`;
};
