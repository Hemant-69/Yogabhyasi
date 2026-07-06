import nodemailer from "nodemailer";

export async function sendEmailNotification(message: {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string | null;
  message: string;
}) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM,
    ADMIN_NOTIFICATION_EMAIL,
    ADMIN_ROUTE_PATH,
    NEXTAUTH_URL,
    NEXT_PUBLIC_APP_URL,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !ADMIN_NOTIFICATION_EMAIL) {
    console.warn("SMTP settings are not configured in environment. Skipping email notification.");
    return;
  }

  try {
    const adminPath = ADMIN_ROUTE_PATH || "dashboard-x7k92m-admin";
    const baseUrl = NEXT_PUBLIC_APP_URL || NEXTAUTH_URL || "https://yogabhyasi.com";
    const actionLink = `${baseUrl}/${adminPath}/messages`;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: SMTP_PORT === "465",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: SMTP_FROM || SMTP_USER,
      to: ADMIN_NOTIFICATION_EMAIL,
      replyTo: message.email,
      subject: `New Inquiry from ${message.name} - Yogabhyasi`,
      text: `
New wellness inquiry received on Yogabhyasi.

Name: ${message.name}
Email: ${message.email}
Phone: ${message.phone}
WhatsApp: ${message.whatsapp || "Not provided"}

Inquiry Message:
${message.message}

---
To reply and take action on this inquiry, please visit the admin dashboard:
${actionLink}
`,
      html: `
<div style="font-family: sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fcfbf9;">
  <h2 style="color: #1b4332; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">🧘 New Yogabhyasi Inquiry</h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="padding: 6px 0; font-weight: bold; width: 100px; color: #475569;">Name:</td>
      <td style="padding: 6px 0; color: #1e293b;">${message.name}</td>
    </tr>
    <tr>
      <td style="padding: 6px 0; font-weight: bold; color: #475569;">Email:</td>
      <td style="padding: 6px 0; color: #1e293b;"><a href="mailto:${message.email}" style="color: #1b4332; text-decoration: underline;">${message.email}</a></td>
    </tr>
    <tr>
      <td style="padding: 6px 0; font-weight: bold; color: #475569;">Phone:</td>
      <td style="padding: 6px 0; color: #1e293b;">${message.phone}</td>
    </tr>
    <tr>
      <td style="padding: 6px 0; font-weight: bold; color: #475569;">WhatsApp:</td>
      <td style="padding: 6px 0; color: #1e293b;">
        ${message.whatsapp ? `<a href="https://wa.me/${message.whatsapp.replace(/[^0-9]/g, '')}" style="color: #1b4332; text-decoration: underline;">${message.whatsapp}</a>` : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'}
      </td>
    </tr>
  </table>
  
  <div style="background-color: #f1f5f9; border-left: 4px solid #1b4332; padding: 15px; margin: 20px 0; border-radius: 8px;">
    <p style="margin: 0; font-style: italic; color: #334155;">"${message.message}"</p>
  </div>

  <div style="margin: 25px 0 15px 0; padding-top: 15px; border-top: 1px dashed #e2e8f0; text-align: center;">
    <a href="${actionLink}" 
       style="display: inline-block; background-color: #1b4332; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; font-family: sans-serif; letter-spacing: 0.5px;">
       ➡️ Take Action in Admin Panel
    </a>
  </div>
</div>
`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email notification sent successfully.");
  } catch (error) {
    console.error("Failed to send email notification:", error);
  }
}

export async function sendTelegramNotification(message: {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string | null;
  message: string;
}) {
  const {
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID,
    ADMIN_ROUTE_PATH,
    NEXTAUTH_URL,
    NEXT_PUBLIC_APP_URL,
  } = process.env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram configuration missing. Skipping Telegram notification.");
    return;
  }

  try {
    const adminPath = ADMIN_ROUTE_PATH || "dashboard-x7k92m-admin";
    const baseUrl = NEXT_PUBLIC_APP_URL || NEXTAUTH_URL || "https://yogabhyasi.com";
    const actionLink = `${baseUrl}/${adminPath}/messages`;

    const text = `🧘 *New Inquiry - Yogabhyasi* 🧘\n\n👤 *Name:* ${message.name}\n✉️ *Email:* ${message.email}\n📞 *Phone:* ${message.phone}\n📱 *WhatsApp:* ${message.whatsapp || "Not provided"}\n\n💬 *Message:*\n"${message.message}"\n\n---\n➡️ *Take Action:* [Open Admin Panel](${actionLink})`;

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Telegram API error response:", errorText);
    } else {
      console.log("Telegram notification sent successfully.");
    }
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
}

export async function sendDirectReplyEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error("SMTP credentials are not configured in your environment.");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_PORT === "465",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: SMTP_FROM || SMTP_USER,
    to: to,
    subject: subject,
    text: body,
    html: `<div style="font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${body}</div>`,
  };

  await transporter.sendMail(mailOptions);
}
