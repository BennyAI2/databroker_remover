import nodemailer from 'nodemailer';
import type { Settings } from './settings';

/**
 * Create a nodemailer transport based on SMTP settings.
 */
export function createTransport(s: Settings) {
  return nodemailer.createTransport({
    host: s.SMTP_HOST,
    port: Number(s.SMTP_PORT || 587),
    secure: String(s.SMTP_SECURE) === 'true',
    auth: s.SMTP_USER
      ? {
          user: s.SMTP_USER,
          pass: s.SMTP_PASS,
        }
      : undefined,
  } as any);
}

/**
 * Send an email using nodemailer. Accepts a partial message with optional overrides.
 */
export async function sendMail(
  s: Settings,
  msg: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string;
    fromOverride?: string;
  }
) {
  const transporter = createTransport(s);
  const info = await transporter.sendMail({
    from: msg.fromOverride || s.SMTP_FROM || 'no-reply@example.local',
    to: msg.to,
    subject: msg.subject,
    text: msg.text,
    html: msg.html,
    replyTo: msg.replyTo || s.REPLY_TO_DEFAULT,
  });
  return info;
}