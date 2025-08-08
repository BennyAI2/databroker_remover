import { createResource, createSignal } from 'solid-js';

async function fetchSettings() {
  const res = await fetch('/api/settings');
  return res.json();
}

export default function Settings() {
  const [settings, { refetch }] = createResource(fetchSettings);
  const [saving, setSaving] = createSignal(false);
  async function save(e: Event) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    await fetch('/api/settings', { method: 'POST', body: fd });
    setSaving(false);
    refetch();
  }
  const s = () => settings() || {};
  return (
    <form class="max-w-2xl space-y-6 p-6" onSubmit={save}>
      <h1 class="text-2xl font-semibold">Settings</h1>
      <section class="space-y-2">
        <h2 class="font-medium">SMTP</h2>
        <input name="SMTP_HOST" placeholder="Host" value={s().SMTP_HOST || ''} />
        <input name="SMTP_PORT" type="number" placeholder="587" value={s().SMTP_PORT || '1025'} />
        <input name="SMTP_USER" placeholder="User" value={s().SMTP_USER || ''} />
        <input name="SMTP_PASS" type="password" placeholder="Password" />
        <label>
          <input type="checkbox" name="SMTP_SECURE" checked={s().SMTP_SECURE === 'true'} /> TLS/SSL
        </label>
        <input
          name="SMTP_FROM"
          placeholder="From e.g. \"Tool <no-reply@...>\""
          value={s().SMTP_FROM || ''}
        />
        <input name="REPLY_TO_DEFAULT" placeholder="Reply-To default" value={s().REPLY_TO_DEFAULT || ''} />
        <select name="REPLY_TO_STRATEGY" value={s().REPLY_TO_STRATEGY || 'fixed'}>
          <option value="fixed">fixed</option>
          <option value="per_user">per_user</option>
          <option value="per_broker">per_broker</option>
        </select>
      </section>
      <section class="space-y-2">
        <h2 class="font-medium">IMAP</h2>
        <input name="IMAP_HOST" placeholder="Host" value={s().IMAP_HOST || ''} />
        <input name="IMAP_PORT" type="number" placeholder="993" value={s().IMAP_PORT || '993'} />
        <input name="IMAP_USER" placeholder="User" value={s().IMAP_USER || ''} />
        <input name="IMAP_PASS" type="password" placeholder="Password" />
        <label>
          <input type="checkbox" name="IMAP_SECURE" checked={s().IMAP_SECURE === 'true'} /> TLS/SSL
        </label>
        <input
          name="IMAP_POLL_INTERVAL"
          type="number"
          placeholder="60"
          value={s().IMAP_POLL_INTERVAL || '60'}
        />
      </section>
      <section class="space-y-2">
        <h2 class="font-medium">Ollama</h2>
        <label>
          <input type="checkbox" name="AI_ENABLED" checked={s().AI_ENABLED === 'true'} /> Enable AI
        </label>
        <input
          name="OLLAMA_URL"
          placeholder="http://ollama:11434"
          value={s().OLLAMA_URL || 'http://ollama:11434'}
        />
        <input
          name="OLLAMA_MODEL"
          placeholder="llama3:8b-instruct"
          value={s().OLLAMA_MODEL || 'llama3:8b-instruct'}
        />
      </section>
      <section class="space-y-2">
        <h2 class="font-medium">General</h2>
        <select name="DEFAULT_JURISDICTION" value={s().DEFAULT_JURISDICTION || 'EU'}>
          <option value="EU">EU</option>
        </select>
        <input name="DATA_RETENTION_DAYS" type="number" value={s().DATA_RETENTION_DAYS || '45'} />
      </section>
      <button class="px-4 py-2 rounded bg-blue-600 text-white" disabled={saving()}>
        {saving() ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}