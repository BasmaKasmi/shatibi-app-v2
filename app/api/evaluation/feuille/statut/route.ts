import evalSheet, { IEvalSheet } from "@/models/evalSheet";
import { Document } from "mongoose";
import sendMails from "@/utils/sendMails";
import { startOfDay } from "date-fns";
import dayjs from "dayjs";

const isMailjetConfigured =
  !!process.env.MAILJET_API_KEY && !!process.env.MAILJET_SECRET_KEY;

export async function POST() {
  const today = startOfDay(new Date());

  try {
    const evalSheets = await evalSheet.find({
      statut: { $nin: ["Supprimé", "Transmise"] },
    });

    if (!Array.isArray(evalSheets) || evalSheets.length === 0) {
      return createResponse({ message: "Aucune donnée trouvée" }, 404);
    }

    const promises: Promise<Document<unknown, {}, IEvalSheet> & IEvalSheet>[] =
      evalSheets.map((sheet) => processEvalSheet(sheet, today));

    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Error processing evalSheet ID: ${evalSheets[index]._id}`,
          result.reason
        );
      }
    });

    return createResponse({ data: evalSheets }, 200);
  } catch (err: any) {
    console.error("Error in POST handler:", err);
    return createResponse(
      { message: "Une erreur est survenue", error: err.message },
      500
    );
  }
}

async function processEvalSheet(
  sheet: Document<unknown, {}, IEvalSheet> & IEvalSheet,
  today: Date
): Promise<Document<unknown, {}, IEvalSheet> & IEvalSheet> {
  const passageDate = startOfDay(new Date(sheet.passageDate));
  const sendDate = sheet.sendDate ? startOfDay(new Date(sheet.sendDate)) : null;

  if (sendDate && sendDate <= today) {
    if (isMailjetConfigured) {
      try {
        await sendNotification(sheet);
      } catch (error) {
        console.warn(
          `Failed to send notification for sheet ${sheet._id}:`,
          error
        );
      }
    }
    sheet.statut = "Transmise";
  } else if (sendDate && sendDate > today) {
    sheet.statut = "Remplis";
  } else if (passageDate >= today) {
    sheet.statut = "À venir";
  } else {
    sheet.statut = "À saisir";
  }

  return sheet.save();
}

async function sendNotification(
  sheet: Document<unknown, {}, IEvalSheet> & IEvalSheet
) {
  if (!isMailjetConfigured) {
    console.log(`[MOCK] Would send notification for sheet ${sheet._id}`);
    return Promise.resolve();
  }

  const dests = [
    { email: "ahh.youb@gmail.com", name: "nom d'un étudiant" },
    { email: "contact@shatibi.fr", name: "le nom d'un étudiant" },
  ];

  console.log(
    "Sending notification for evalSheet at",
    dayjs(sheet.sendDate).locale()
  );

  return sendMails(
    dests,
    "Sujet du mail",
    `Votre note pour ${sheet.subject} est disponible sur Shatibi`,
    `Votre note pour ${sheet.subject} est disponible sur <a href='${
      process.env.BASE_URL || "http://localhost:3000"
    }'>Shatibi</a>`,
    dayjs(sheet.sendDate).locale()
  );
}

function createResponse(data: any, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
