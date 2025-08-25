"use client";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import ReactQueryProvider from "../react-query-provider";
import { DatesProvider } from "@mantine/dates";
import { StudentProvider } from "@/app/StudentContext";
import "@mantine/core/styles.css";
import { DateProvider } from "../DateContext";

const StudentProviders = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>
    <ModalsProvider>
      <DateProvider>
        <DatesProvider settings={{ locale: "fr" }}>
          <StudentProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </StudentProvider>
        </DatesProvider>
      </DateProvider>
    </ModalsProvider>
  </MantineProvider>
);

export default StudentProviders;
