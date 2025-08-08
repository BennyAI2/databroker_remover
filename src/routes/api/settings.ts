import type { APIEvent } from 'solid-start/api';
import { getSettings, setSettings } from '~/server/settings';

export async function GET() {
  return new Response(JSON.stringify(getSettings()), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request }: APIEvent) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const body = await request.json();
    const sanitized: Record<string, string> = {};
    for (const [k, v] of Object.entries(body)) {
      // Preserve existing passwords unless a new one is provided
      if (k.endsWith('_PASS') && !v) continue;
      sanitized[k] = String(v);
    }
    setSettings(sanitized);
    return new Response('OK');
  }
  const form = await request.formData();
  const obj: Record<string, string> = {};
  form.forEach((v, k) => {
    if (k.endsWith('_PASS') && !v) return;
    obj[k] = String(v);
  });
  setSettings(obj);
  return new Response('OK');
}