import type { Metadata } from "next";
import "../../globals.css";
import { poppins } from "@/style/fonts";
import StudentProviders from "./providers";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Shatibi - Espace Étudiant",
  description: "Votre espace étudiant Shatibi",
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body style={poppins.style}>
        <StudentProviders>{children}</StudentProviders>
        <ToastContainer />
      </body>
    </html>
  );
}
