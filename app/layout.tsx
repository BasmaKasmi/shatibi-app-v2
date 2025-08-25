import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/style/fonts";
import Providers from "./providers";
import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";

dayjs.locale("fr");

export const metadata: Metadata = {
  title: "Shatibi",
  description: "Gérer vos cours avec l'application Shatibi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body style={poppins.style}>
        <Providers>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
