export function cn(...classes: (string | undefined | null)[]) {
  return classes
    .filter((cls): cls is string => typeof cls === "string")
    .join(" ");
}
