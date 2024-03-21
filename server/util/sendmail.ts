/**
 * server/util/sendmail
 *
 * 메일 보내기에 필요한 함수
 */

import { createTransport } from "nodemailer"
import { MailOptions } from "nodemailer/lib/json-transport"

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  if (process.env.GMAIL_APP_PASSWORD === undefined || process.env.GMAIL_APP_PASSWORD === "") {
    console.log(`[util/sendMail] requires app password from your google account.`)
    return
  }

  try {
    const transporter = createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: process.env.GMAIL_ID!,
        pass: process.env.GMAIL_APP_PASSWORD!,
      },
    })

    const options: MailOptions = {
      from: process.env.GMAIL_ID,
      to,
      subject,
      html,
    }

    await transporter.sendMail(options)
  } catch (e: any) {
    console.log(`[util/sendMail] ${e}`)
  }
}
