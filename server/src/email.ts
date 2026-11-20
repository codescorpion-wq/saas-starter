import { Resend } from "resend";
import { env } from "./env.js";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log(`\n📧 [email not sent — no RESEND_API_KEY]\nTo: ${to}\nSubject: ${subject}\n${html}\n`);
    return;
  }
  const { error } = await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html });
  if (error) console.error("Email failed:", error);
}
