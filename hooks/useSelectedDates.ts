import { useState, useEffect } from "react";

const useSelectedDates = (pageKey: string, defaultDays = 35) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectorDate, setSelectorDate] = useState<string>("");

  const getCurrentMonday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split("T")[0];
  };

  const getPreviousMonday = (date: string) => {
    const monday = new Date(date);
    monday.setDate(monday.getDate() - 7);
    return monday.toISOString().split("T")[0];
  };

  const storagePrefix = `dates_${pageKey}_`;

  const initDefaultDates = () => {
    const currentMonday = getCurrentMonday();
    const previousMonday = getPreviousMonday(currentMonday);

    setStartDate(previousMonday);
    setSelectorDate(previousMonday);

    const initialEndDate = new Date(previousMonday);
    initialEndDate.setDate(initialEndDate.getDate() + defaultDays);

    setEndDate(initialEndDate.toISOString().split("T")[0]);

    sessionStorage.setItem(`${storagePrefix}startDate`, previousMonday);
    sessionStorage.setItem(
      `${storagePrefix}endDate`,
      initialEndDate.toISOString().split("T")[0]
    );
    sessionStorage.setItem(`${storagePrefix}selectorDate`, previousMonday);
  };

  useEffect(() => {
    const sessionStartDate = sessionStorage.getItem(
      `${storagePrefix}startDate`
    );
    const sessionEndDate = sessionStorage.getItem(`${storagePrefix}endDate`);
    const sessionSelectorDate = sessionStorage.getItem(
      `${storagePrefix}selectorDate`
    );

    if (sessionStartDate && sessionEndDate && sessionSelectorDate) {
      setStartDate(sessionStartDate);
      setEndDate(sessionEndDate);
      setSelectorDate(sessionSelectorDate);
    } else {
      const currentMonday = getCurrentMonday();
      const previousMonday = getPreviousMonday(currentMonday);

      setStartDate(previousMonday);
      setSelectorDate(previousMonday);

      const initialEndDate = new Date(previousMonday);
      initialEndDate.setDate(initialEndDate.getDate() + 28);
      setEndDate(initialEndDate.toISOString().split("T")[0]);

      sessionStorage.setItem(`${storagePrefix}startDate`, previousMonday);
      sessionStorage.setItem(
        `${storagePrefix}endDate`,
        initialEndDate.toISOString().split("T")[0]
      );
      sessionStorage.setItem(`${storagePrefix}selectorDate`, previousMonday);
    }
  }, [pageKey, defaultDays, storagePrefix]);

  const handleStartDateChange = (newDate: string) => {
    setStartDate(newDate);
    setSelectorDate(newDate);

    if (endDate < newDate) {
      const newEndDate = new Date(newDate);
      newEndDate.setDate(newEndDate.getDate() + 7);
      setEndDate(newEndDate.toISOString().split("T")[0]);
      sessionStorage.setItem(
        `${storagePrefix}endDate`,
        newEndDate.toISOString().split("T")[0]
      );
    }

    sessionStorage.setItem(`${storagePrefix}startDate`, newDate);
    sessionStorage.setItem(`${storagePrefix}selectorDate`, newDate);
  };

  const handleEndDateChange = (newDate: string) => {
    if (newDate >= startDate) {
      setEndDate(newDate);
      sessionStorage.setItem(`${storagePrefix}endDate`, newDate);
    }
  };

  const resetDates = () => {
    sessionStorage.removeItem(`${storagePrefix}startDate`);
    sessionStorage.removeItem(`${storagePrefix}endDate`);
    sessionStorage.removeItem(`${storagePrefix}selectorDate`);

    initDefaultDates();
  };

  return {
    startDate,
    endDate,
    selectorDate,
    handleStartDateChange,
    handleEndDateChange,
    resetDates,
  };
};

export default useSelectedDates;
