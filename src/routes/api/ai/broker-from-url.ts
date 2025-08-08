import type { APIEvent } from 'solid-start/api';
import { getSettings } from '~/server/settings';

export async function POST({ request }: APIEvent) {
  const { url } = (await request.json()) as { url: string };
  const settings = getSettings();
  if (String(settings.AI_ENABLED) !== 'true') {
    return new Response(JSON.stringify({ error: 'AI disabled' }), { status: 400 });
  }
  // Fetch the page content. This uses fetch on the server side.
  const page = await fetch(url).then(r => r.text());
  const prompt = `Extract data broker contact info for EU GDPR requests from the given page text.\\nReturn JSON with keys:\\n{name, legal_entity, country, privacy_policy_url, contact_email, contact_portal_url, requires_id_proof, notes, source_url, eu_relevant, reasoning}\\nPage URL: ${url}\\nPage Text (truncated to 10k chars):\\n${page.slice(0, 10000)}\\n`;
  const res = await fetch(`${settings.OLLAMA_URL || 'http://ollama:11434'}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: settings.OLLAMA_MODEL || 'llama3:8b-instruct', prompt, stream: false }),
  }).then(r => r.json());
  let data: any = {};
  try {
    data = JSON.parse(res.response || '{}');
  } catch {
    data = {};
  }
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}