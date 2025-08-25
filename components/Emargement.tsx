"use client";

import { displayFullDate } from "@/lib/dates";

const Emargement = ({ emargement, onClick }: any) => {
  return (
    <div
      key={
        emargement.date +
        emargement.name +
        emargement.session +
        emargement.time +
        emargement.slot
      }
      onClick={onClick}
      className="rounded-xl bg-white px-4 py-2 text-sm"
    >
      <h2 className="font-semibold">
        {emargement.name ? emargement.name : "Nom du cours indisponible"}
      </h2>
      <div className="flex justify-between items-center">
        <p className="italic text-shatibi-grey text-xs font-semibold">
          {displayFullDate(emargement.date)} à {emargement.time}
        </p>
      </div>
    </div>
  );
};

export default Emargement;
