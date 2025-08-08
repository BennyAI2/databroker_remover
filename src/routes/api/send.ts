import type { APIEvent } from 'solid-start/api';
import { db } from '~/server/db/sqlite';
import { getSettings } from '~/server/settings';
import { sendMail } from '~/server/mailer';

/**
 * Compute the Reply-To address based on strategy settings.
 */
function computeReplyTo(settings: Record<string, string>, brokerId: string, userEmail: string) {
  const strategy = settings.REPLY_TO_STRATEGY || 'fixed';
  if (strategy === 'per_broker') {
    const safe = brokerId.replace(/[^a-z0-9]/gi, '');
    const base = (settings.REPLY_TO_DEFAULT || '').split('@');
    if (base.length === 2) return `${base[0]}+${safe}@${base[1]}`;
  }
  if (strategy === 'per_user') {
    const safe = (userEmail || 'user').replace(/[^a-z0-9]/gi, '');
    const base = (settings.REPLY_TO_DEFAULT || '').split('@');
    if (base.length === 2) return `${base[0]}+${safe}@${base[1]}`;
  }
  return settings.REPLY_TO_DEFAULT;
}

export async function POST({ request }: APIEvent) {
  const settings = getSettings();
  const body = await request.json();
  const { user, brokerIds } = body as {
    user: { name: string; email: string; address: string; country: string };
    brokerIds: string[];
  };
  // Fetch selected brokers from database
  const placeholders = brokerIds.map(() => '?').join(',');
  const brokers = db
    .prepare(`SELECT * FROM brokers WHERE id IN (${placeholders})`)
    .all(...brokerIds);
  for (const broker of brokers) {
    // Basic GDPR email template
    const subject = `GDPR Data Deletion Request (Art. 17) – ${user.name}`;
    const text = `Hello ${broker.name || 'Data Protection Officer'},\\n\\nI am exercising my rights under GDPR (Articles 15, 17, 21). Please delete my personal data and confirm.\\nName: ${user.name}\\nEmail: ${user.email}\\nAddress: ${user.address}\\nCountry: ${user.country}\\n\\nRegards,\\n${user.name}`;
    const replyTo = computeReplyTo(settings, broker.id, user.email);
    const info = await sendMail(settings, {
      to: broker.contact_email || '',
      subject,
      text,
      replyTo,
    });
    db.prepare(
      `INSERT INTO sent_emails (broker_id, to_address, reply_to, subject, body, message_id) VALUES (?,?,?,?,?,?)`
    ).run(
      broker.id,
      broker.contact_email || '',
      replyTo || '',
      subject,
      text,
      (info as any).messageId || ''
    );
  }
  return new Response('OK');
}