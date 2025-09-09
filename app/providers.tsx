"use client";
import "dayjs/locale/fr";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import ReactQueryProvider from "./react-query-provider";
import { DatesProvider } from "@mantine/dates";
import { TeacherProvider } from "@/app/TeacherContext";
import "@mantine/core/styles.css";
import { DateProvider } from "./DateContext";
import { UniversDetectionProvider } from "@/hooks/useUniversDetection";
import { AuthCheck } from "@/components/AuthCheck";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider>
      <ModalsProvider>
        <DateProvider>
          <DatesProvider
            settings={{
              locale: "fr",
            }}
          >
            <TeacherProvider>
              <UniversDetectionProvider>
                <ReactQueryProvider>
                  <AuthCheck>{children}</AuthCheck>
                </ReactQueryProvider>
              </UniversDetectionProvider>
            </TeacherProvider>
          </DatesProvider>
        </DateProvider>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default Providers;
