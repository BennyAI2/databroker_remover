import { createResource, createSignal } from 'solid-js';

async function fetchBrokers() {
  const res = await fetch('/api/brokers');
  return res.json();
}

export default function Brokers() {
  const [brokers, { refetch }] = createResource(fetchBrokers);
  const [url, setUrl] = createSignal('');
  const [aiCandidate, setAiCandidate] = createSignal<any>(null);
  const [loading, setLoading] = createSignal(false);
  async function addViaAI() {
    setLoading(true);
    const res = await fetch('/api/ai/broker-from-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url() }),
    });
    setAiCandidate(await res.json());
    setLoading(false);
  }
  async function saveCandidate() {
    const c = aiCandidate();
    if (!c?.eu_relevant) return;
    const id = (c.name || c.legal_entity || c.contact_email || crypto.randomUUID())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    await fetch('/api/brokers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name: c.name,
        legal_entity: c.legal_entity,
        country: c.country || 'EU',
        privacy_policy_url: c.privacy_policy_url,
        contact_email: c.contact_email,
        contact_portal_url: c.contact_portal_url,
        requires_id_proof: c.requires_id_proof ? 1 : 0,
        notes: c.notes,
        source_url: c.source_url,
      }),
    });
    setAiCandidate(null);
    setUrl('');
    refetch();
  }
  return (
    <div class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Brokers</h1>
      <div class="flex gap-2 items-center">
        <input
          class="flex-1"
          placeholder="https://example.com/privacy"
          value={url()}
          onInput={e => setUrl(e.currentTarget.value)}
        />
        <button
          class="px-3 py-2 rounded bg-slate-700 text-white"
          disabled={loading()}
          onClick={addViaAI}
        >
          {loading() ? 'Analyzing...' : 'Add via URL (AI)'}
        </button>
      </div>
      {aiCandidate() && (
        <div class="border rounded p-3">
          <pre class="text-sm whitespace-pre-wrap">{JSON.stringify(aiCandidate(), null, 2)}</pre>
          {aiCandidate().eu_relevant ? (
            <button class="mt-2 px-3 py-2 rounded bg-green-600 text-white" onClick={saveCandidate}>
              Approve & Save
            </button>
          ) : (
            <div class="mt-2 text-red-600">Not EU-relevant — not saving.</div>
          )}
        </div>
      )}
      <table class="w-full text-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Email</th>
            <th>Portal</th>
            <th>Policy</th>
          </tr>
        </thead>
        <tbody>
          {brokers()?.map((b: any) => (
            <tr>
              <td>{b.name}</td>
              <td>{b.country}</td>
              <td>{b.contact_email}</td>
              <td>
                <a class="text-blue-600 underline" href={b.contact_portal_url} target="_blank">
                  Portal
                </a>
              </td>
              <td>
                <a class="text-blue-600 underline" href={b.privacy_policy_url} target="_blank">
                  Policy
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}