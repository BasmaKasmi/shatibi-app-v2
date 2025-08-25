import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface DateContextType {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  resetDates: () => void;
  clearAllDateSessions: () => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const defaultStartDate = new Date().toISOString().split("T")[0];
  const defaultEndDate = new Date(new Date().setDate(new Date().getDate() + 35))
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);

  useEffect(() => {
    const storedStartDate = localStorage.getItem("startDate");
    const storedEndDate = localStorage.getItem("endDate");

    if (storedStartDate && storedEndDate) {
      setStartDate(storedStartDate);
      setEndDate(storedEndDate);
    } else {
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [defaultStartDate, defaultEndDate]);

  const handleSetStartDate = (date: string) => {
    setStartDate(date);
    localStorage.setItem("startDate", date);
  };

  const handleSetEndDate = (date: string) => {
    setEndDate(date);
    localStorage.setItem("endDate", date);
  };

  const resetDates = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
  };

  const clearAllDateSessions = () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("dates_")) {
        sessionStorage.removeItem(key);
      }
    });
    resetDates();
  };

  return (
    <DateContext.Provider
      value={{
        startDate,
        setStartDate: handleSetStartDate,
        endDate,
        setEndDate: handleSetEndDate,
        resetDates,
        clearAllDateSessions,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};
