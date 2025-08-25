export default async function sendMails(
  destinations: Array<{ email: string; name: string }>,
  subject: string,
  textContent: string,
  htmlContent: string,
  scheduleAt?: any
) {
  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
    console.log("[MOCK] Would send email:", {
      to: destinations,
      subject,
      text: textContent,
    });
    return Promise.resolve({
      success: true,
      mock: true,
    });
  }

  try {
    const MailjetModule = await import("node-mailjet");
    const mailjet = MailjetModule.default.apiConnect(
      process.env.MAILJET_API_KEY as string,
      process.env.MAILJET_SECRET_KEY as string
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    return Promise.reject(error);
  }
}
