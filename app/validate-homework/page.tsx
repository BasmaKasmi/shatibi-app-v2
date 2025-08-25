"use client";
import { useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import SectionTitleWithBackButton from "@/components/SectionTitleWithBackButton";

export default function ValidateHomework() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text");
  const fileName = searchParams.get("fileName");
  const fileMime = searchParams.get("fileMime");
  const fileBase64 = searchParams.get("fileBase64");

  return (
    <div className="h-dvh flex flex-col gap-4 relative overflow-hidden md:hidden pb-16">
      <SectionTitleWithBackButton title="Travail à faire" />

      <div className="flex-grow p-4">
        <h1 className="text-lg font-semibold">Validation du Travail</h1>
        {text && <p className="mt-2 text-sm">{text}</p>}
        {fileName && fileMime && fileBase64 && (
          <a
            href={`data:${fileMime};base64,${fileBase64}`}
            download={fileName}
            className="text-blue-600 hover:underline mt-4 block"
          >
            Télécharger {fileName}
          </a>
        )}
      </div>

      <div className="absolute bottom-2 left-0 w-full p-4 bg-white">
        <Button className="w-full font-bold" variant="green">
          Valider le travail
        </Button>
      </div>
    </div>
  );
}
