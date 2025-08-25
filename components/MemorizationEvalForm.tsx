"use client";
import { useState } from "react";

const MemorizationEvalForm = () => {
  const evaluationOptions = [
    { id: "acquis", label: "Acquis" },
    { id: "renforcer", label: "À renforcer" },
    { id: "non_acquis", label: "Non acquis" },
  ];

  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(
    null
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-6">
        {evaluationOptions.map((option) => (
          <label key={option.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedEvaluation === option.id}
              onChange={() => setSelectedEvaluation(option.id)}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span className="text-black text-xs">{option.label}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-black text-xs font-bold">
          Ajouter une appreciation
        </h3>
        <textarea
          className="w-full p-3 border rounded-2xl h-32 bg-white font-medium text-xs"
          placeholder=""
        />
      </div>
    </div>
  );
};

export default MemorizationEvalForm;
