/**
 * server/util/sendmail
 *
 * 메일 보내기에 필요한 함수
 */

import { createTransport } from "nodemailer"
import { MailOptions } from "nodemailer/lib/json-transport"

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  try {
    const transporter = createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_OAUTH_USER,
        clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
        clientSecret: process.env.GAMIL_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GAMIL_OAUTH_REFRESH_TOKEN,
      },
    })

    const options: MailOptions = {
      from: process.env.GMAIL_OAUTH_USER,
      to,
      subject,
      html,
    }

    await transporter.sendMail(options)
  } catch (e: any) {
    console.log(`[util/sendMail] ${e}`)
  }
}
