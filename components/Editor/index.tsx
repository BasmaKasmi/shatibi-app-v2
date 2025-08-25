"use client";

import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const MODULES = {
  toolbar: {
    container: [
      [{ list: "ordered" }, { list: "bullet" }, "blockquote", { align: [] }],
      [{ color: [] }, { background: [] }, "link"],
    ],
    handlers: {
      link(this: any) {
        const href = prompt("Enter the URL");
        if (href) {
          const range = this.quill.getSelection();
          this.quill.format("link", href);
        }
      },
    },
  },
};

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Editor({
  value,
  onChange,
  placeholder,
  className,
}: EditorProps) {
  return (
    <div
      className={cn(
        "relative w-full border border-gray-300 rounded-lg bg-white overflow-hidden",
        className
      )}
    >
      <style jsx global>{`
        .ql-toolbar {
          border: 0 !important;
          @apply sticky top-0 z-10 bg-white border-b border-gray-200;
        }
        .ql-container {
          border: 0 !important;
          height: auto !important;
        }
        .ql-editor {
          border-top: 2px solid #e5e7eb !important;
          min-height: calc(7 * 1.5rem + 2rem) !important;
          max-height: calc(11 * 1.5rem + 2rem) !important;
          overflow-y: auto !important;
          @apply text-base leading-6 p-4 w-full;
        }
      `}</style>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={MODULES}
        placeholder={placeholder}
        className={cn(
          "w-full [&_.ql-editor]:focus:outline-none",
          "[&_.ql-toolbar]:border-0",
          "[&_.ql-container]:border-0",
          "[&_.ql-editor]:min-h-[11rem]",
          "[&_.ql-editor]:max-h-[17rem]",
          "[&_.ql-editor]:overflow-y-auto",
          "[&_.ql-editor]:scrollbar-thin",
          "[&_.ql-editor]:scrollbar-thumb-gray-400",
          "[&_.ql-editor]:scrollbar-track-gray-100"
        )}
      />
    </div>
  );
}
