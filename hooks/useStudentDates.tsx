import { useState, useEffect } from "react";

const useStudentDates = (pageKey: string, futureDaysCount = 35) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectorDate, setSelectorDate] = useState<string>("");

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getFutureDate = (days: number) => {
    const future = new Date();
    future.setDate(future.getDate() + days);
    return future.toISOString().split("T")[0];
  };

  const storagePrefix = `student_dates_${pageKey}_`;

  const initDefaultDates = () => {
    const today = getCurrentDate();
    const futureDate = getFutureDate(futureDaysCount);

    console.log("Initialisation des dates:", {
      today,
      futureDate,
      futureDaysCount,
    });

    setStartDate(today);
    setSelectorDate(today);
    setEndDate(futureDate);

    sessionStorage.setItem(`${storagePrefix}startDate`, today);
    sessionStorage.setItem(`${storagePrefix}endDate`, futureDate);
    sessionStorage.setItem(`${storagePrefix}selectorDate`, today);
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
      initDefaultDates();
    }
  }, [pageKey, futureDaysCount, storagePrefix]);

  const handleStartDateChange = (newDate: string) => {
    setStartDate(newDate);
    setSelectorDate(newDate);

    if (endDate < newDate) {
      const newEndDate = new Date(newDate);
      newEndDate.setDate(newEndDate.getDate() + futureDaysCount);
      const formattedEndDate = newEndDate.toISOString().split("T")[0];
      setEndDate(formattedEndDate);
      sessionStorage.setItem(`${storagePrefix}endDate`, formattedEndDate);
    }

    sessionStorage.setItem(`${storagePrefix}startDate`, newDate);
    sessionStorage.setItem(`${storagePrefix}selectorDate`, newDate);

    console.log("Dates après changement de date de début:", {
      start: newDate,
      end: endDate,
    });
  };

  const handleEndDateChange = (newDate: string) => {
    if (newDate >= startDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(newDate);
      const diffTime = Math.abs(endDateObj.getTime() - startDateObj.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let actualEndDate = newDate;
      if (diffDays > 45) {
        const limitedEndDate = new Date(startDate);
        limitedEndDate.setDate(limitedEndDate.getDate() + 45);
        actualEndDate = limitedEndDate.toISOString().split("T")[0];
      }

      setEndDate(actualEndDate);
      sessionStorage.setItem(`${storagePrefix}endDate`, actualEndDate);

      console.log("Date de fin changée:", actualEndDate);
    }
  };

  const resetDates = () => {
    sessionStorage.removeItem(`${storagePrefix}startDate`);
    sessionStorage.removeItem(`${storagePrefix}endDate`);
    sessionStorage.removeItem(`${storagePrefix}selectorDate`);

    initDefaultDates();
  };

  const forceReset = () => {
    sessionStorage.removeItem(`${storagePrefix}startDate`);
    sessionStorage.removeItem(`${storagePrefix}endDate`);
    sessionStorage.removeItem(`${storagePrefix}selectorDate`);

    const today = getCurrentDate();
    const futureDate = getFutureDate(futureDaysCount);

    setStartDate(today);
    setSelectorDate(today);
    setEndDate(futureDate);

    sessionStorage.setItem(`${storagePrefix}startDate`, today);
    sessionStorage.setItem(`${storagePrefix}endDate`, futureDate);
    sessionStorage.setItem(`${storagePrefix}selectorDate`, today);

    console.log("Dates forcées à la réinitialisation:", { today, futureDate });
  };

  return {
    startDate,
    endDate,
    selectorDate,
    handleStartDateChange,
    handleEndDateChange,
    resetDates,
    forceReset,
  };
};

export default useStudentDates;
