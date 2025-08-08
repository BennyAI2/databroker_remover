import { db } from '~/server/db/sqlite';

export async function GET() {
  const rows = db
    .prepare(
      `SELECT r.*, s.broker_id FROM replies r LEFT JOIN sent_emails s ON s.id = r.sent_email_id ORDER BY r.received_at DESC`
    )
    .all();
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}