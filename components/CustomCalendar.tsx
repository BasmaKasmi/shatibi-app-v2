import React, { useState, useRef, useEffect } from "react";

interface CustomCalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  availableDates?: string[];
  isLoading?: boolean;
  onMonthChange?: (year: number, month: number) => void;
  datesWithContent?: string[];
  completeDates?: string[];
  emptyDates?: string[];
}

interface CalendarDay {
  date: Date;
  dateStr: string;
  day: number;
  isCurrentMonth: boolean;
  isAvailable: boolean;
  isSelected: boolean;
  isToday: boolean;
  hasContent?: boolean;
  isComplete?: boolean;
  isEmpty?: boolean;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onDateChange,
  availableDates = [],
  isLoading = false,
  onMonthChange,
  datesWithContent = [],
  completeDates = [],
  emptyDates = [],
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return "Choisir une date";

    const [year, month, day] = dateString.split("-");

    if (!year || !month || !day) {
      console.error("Format de date invalide:", dateString);
      return "Date invalide";
    }

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (onMonthChange) {
      onMonthChange(currentMonth.getFullYear(), currentMonth.getMonth());
    }
  }, [currentMonth, onMonthChange]);

  const generateCalendar = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);

    const days: CalendarDay[] = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dateStr = `${current.getFullYear()}-${String(
        current.getMonth() + 1
      ).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;

      const isCurrentMonth = current.getMonth() === month;
      const isAvailable = availableDates.includes(dateStr);
      const isSelected = dateStr === selectedDate;

      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const isToday = dateStr === todayStr;

      const hasContent = datesWithContent.includes(dateStr);
      const isComplete = completeDates.includes(dateStr);
      const isEmpty = emptyDates.includes(dateStr);

      days.push({
        date: new Date(current),
        dateStr,
        day: current.getDate(),
        isCurrentMonth,
        isAvailable,
        isSelected,
        isToday,
        hasContent,
        isComplete,
        isEmpty,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const handleDateClick = (dateStr: string): void => {
    onDateChange(dateStr);
    setIsOpen(false);
  };

  const nextMonth = (): void => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1
    );
    setCurrentMonth(newMonth);
  };

  const prevMonth = (): void => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1
    );
    setCurrentMonth(newMonth);
  };

  const goToToday = (): void => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    onDateChange(todayStr);
    setCurrentMonth(new Date());
    setIsOpen(false);
  };

  const clearDate = (): void => {
    onDateChange("");
    setIsOpen(false);
  };

  const monthNames = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  const days = generateCalendar();

  return (
    <div className="relative" ref={calendarRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-[140px] border border-gray-200 rounded-full p-1 text-center text-xs cursor-pointer bg-white hover:bg-gray-50 flex items-center justify-center"
      >
        {isLoading ? "Chargement..." : formatDisplayDate(selectedDate)}
      </div>

      {isOpen && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] p-3"
          style={{
            width: "280px",
            maxHeight: "350px",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 rounded text-sm w-6 h-6 flex items-center justify-center"
              type="button"
            >
              ←
            </button>

            <h3 className="font-semibold text-xs">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>

            <button
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded text-sm w-6 h-6 flex items-center justify-center"
              type="button"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["L", "M", "M", "J", "V", "S", "D"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-500 py-1"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 mb-3">
            {days.map((day, index) => {
              let className =
                "text-center py-1 text-xs cursor-pointer rounded transition-colors h-6 w-6 flex items-center justify-center ";

              if (!day.isCurrentMonth) {
                className += "text-gray-300 ";
              } else if (day.isSelected) {
                className += "bg-blue-500 text-white ";
              } else if (day.isToday) {
                className += "bg-blue-100 text-blue-600 font-bold ";
              } else if (day.isComplete) {
                className +=
                  "bg-shatibi-green/[.15] text-shatibi-green font-semibold";
              } else if (day.hasContent) {
                className +=
                  "bg-shatibi-green/[.15] text-shatibi-green font-semibold  ";
              } else if (day.isEmpty) {
                className +=
                  "bg-shatibi-red/[.15] text-shatibi-red font-semibold ";
              } else if (day.isAvailable) {
                className += "bg-gray-100 text-gray-700 hover:bg-gray-200 ";
              } else {
                className += "text-gray-400 hover:bg-gray-100 ";
              }

              return (
                <div
                  key={index}
                  className={className}
                  onClick={() =>
                    day.isCurrentMonth && handleDateClick(day.dateStr)
                  }
                  title={
                    day.isComplete
                      ? "Liaison et devoir remplis"
                      : day.hasContent
                      ? "Partiellement rempli"
                      : day.isEmpty
                      ? "Vide"
                      : ""
                  }
                >
                  {day.day}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between border-t border-gray-100 pt-2">
            <button
              onClick={clearDate}
              className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1"
              type="button"
            >
              Effacer
            </button>
            <button
              onClick={goToToday}
              className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1"
              type="button"
            >
              Aujourd&apos;hui
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
