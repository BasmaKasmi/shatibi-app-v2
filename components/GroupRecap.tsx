"use client";

import { formatNumber } from "@/lib/format-utils";

type GroupRecap = {
  inscrits: number;
  abandons: number;
  presence: number;
  session: string;
};

const GroupRecap = ({ groupRecap }: { groupRecap: GroupRecap }) => {
  const items = [
    { name: "Inscrits", number: groupRecap.inscrits, isPercentage: false },
    { name: "Abandons", number: groupRecap.abandons, isPercentage: false },
    {
      name: "Présence",
      number: formatNumber(groupRecap.presence),
      isPercentage: true,
    },
    { name: "Progression", number: groupRecap.session, isPercentage: false },
  ];

  return (
    <div className="container mx-auto max-w-lg">
      <h2 className="text-xl font-bold text-center mb-6">
        Récapitulatif du groupe
      </h2>
      <div className="grid grid-cols-4 justify-items-center gap-x-12 px-6">
        {items.map(({ name, number, isPercentage }) => (
          <div key={name} className="flex flex-col items-center w-full">
            <span className="text-base font-bold">
              {number}
              {isPercentage ? "%" : ""}
            </span>
            <div className="text-xs text-center">{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupRecap;
