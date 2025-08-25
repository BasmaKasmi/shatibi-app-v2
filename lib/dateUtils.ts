export const clearAllStudentDates = () => {
  const keysToRemove: string[] = [];

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith("student_dates_")) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => {
    sessionStorage.removeItem(key);
  });

  console.log("Toutes les dates de students nettoyées:", keysToRemove);
};

export const clearStudentDatesForPage = (pageKey: string) => {
  const storagePrefix = `student_dates_${pageKey}_`;

  sessionStorage.removeItem(`${storagePrefix}startDate`);
  sessionStorage.removeItem(`${storagePrefix}endDate`);
  sessionStorage.removeItem(`${storagePrefix}selectorDate`);

  console.log(`Dates nettoyées pour la page: ${pageKey}`);
};
