import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_AUTH,
    pass: process.env.MAIL_PASS,
  },
});
 

export async function sendContactToOwner({ email, message }) {
  if (!process.env.MAIL_AUTH) throw new Error("MAIL_AUTH is not configured");
  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.MAIL_AUTH}>`,
    to: process.env.MAIL_AUTH,
    replyTo: email,
    subject: "New contact form message",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin:auto;">
        <h2>New message from portfolio contact form</h2>
        <p><b>From:</b> ${email}</p>
        <p><b>Message:</b></p>
        <div style="white-space: pre-wrap; background:#f9fafb; border:1px solid #e5e7eb; padding:12px; border-radius:8px;">${message}</div>
      </div>
    `,
  });
}

export async function sendContactAckToUser({ email }) {
  if (!email) return;
  await transporter.sendMail({
    from: `"Pankaj Portfolio" <${process.env.MAIL_AUTH}>`,
    to: email,
    subject: "Thanks for reaching out!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin:auto;">
        <h2>Thanks for contacting me</h2>
        <p>I received your message and will get back to you soon.</p>
      </div>
    `,
  });
}
