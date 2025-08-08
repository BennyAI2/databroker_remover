import type { APIEvent } from 'solid-start/api';
import { db } from '~/server/db/sqlite';

export async function GET({ request }: APIEvent) {
  const url = new URL(request.url);
  const country = url.searchParams.get('country');
  const rows = country
    ? db.prepare('SELECT * FROM brokers WHERE country = ?').all(country)
    : db.prepare('SELECT * FROM brokers').all();
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request }: APIEvent) {
  const body = await request.json();
  db.prepare(
    `INSERT INTO brokers (id, name, country, legal_entity, privacy_policy_url, contact_email, contact_portal_url, requires_id_proof, notes, source_url, last_verified_at)
     VALUES (@id, @name, @country, @legal_entity, @privacy_policy_url, @contact_email, @contact_portal_url, @requires_id_proof, @notes, @source_url, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       country = excluded.country,
       legal_entity = excluded.legal_entity,
       privacy_policy_url = excluded.privacy_policy_url,
       contact_email = excluded.contact_email,
       contact_portal_url = excluded.contact_portal_url,
       requires_id_proof = excluded.requires_id_proof,
       notes = excluded.notes,
       source_url = excluded.source_url,
       last_verified_at = datetime('now')
    `
  ).run(body);
  return new Response('OK');
}