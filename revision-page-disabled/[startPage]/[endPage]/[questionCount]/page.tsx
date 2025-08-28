"use client";
import { useParams } from "next/navigation";
import RevisionPage from "@/components/RevisionPage";

export default function Page() {
  const params = useParams();
  return (
    <RevisionPage
      startPage={params.startPage as string}
      endPage={params.endPage as string}
      questionCount={parseInt(params.questionCount as string)}
    />
  );
}
