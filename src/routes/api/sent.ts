import { db } from '~/server/db/sqlite';

export async function GET() {
  const rows = db
    .prepare(
      `SELECT s.*, (SELECT COUNT(*) FROM replies r WHERE r.sent_email_id = s.id) as reply_count FROM sent_emails s ORDER BY s.sent_at DESC`
    )
    .all();
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}