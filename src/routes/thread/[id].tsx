import { createResource } from 'solid-js';
import { useParams } from '@solidjs/router';

export default function Thread() {
  const params = useParams();
  const id = () => params.id;
  const [data] = createResource(async () => {
    const all = await (await fetch('/api/replies')).json();
    return all.filter((r: any) => String(r.sent_email_id) === String(id()));
  });
  return (
    <div class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Thread #{id()}</h1>
      {data()?.map((r: any) => (
        <div class="rounded border p-3">
          <div class="text-xs text-gray-500">
            {new Date(r.received_at).toLocaleString()} — from {r.from_address}
          </div>
          <div class="font-medium">{r.subject}</div>
          <pre class="whitespace-pre-wrap text-sm">{r.body}</pre>
          {r.summary && (
            <div class="mt-2 p-2 bg-gray-50 border">
              {r.summary}{' '}
              <span class="ml-2 text-xs px-2 py-1 rounded bg-yellow-100">{r.status}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}