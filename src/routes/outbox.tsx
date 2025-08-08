import { createResource } from 'solid-js';

async function fetchSent() {
  const res = await fetch('/api/sent');
  return res.json();
}

export default function Outbox() {
  const [sent] = createResource(fetchSent);
  return (
    <div class="p-6">
      <h1 class="text-2xl font-semibold mb-4">Outbox</h1>
      <table class="w-full text-sm">
        <thead>
          <tr>
            <th>Date</th>
            <th>Broker</th>
            <th>To</th>
            <th>Reply-To</th>
            <th>Replies</th>
          </tr>
        </thead>
        <tbody>
          {sent()?.map((r: any) => (
            <tr>
              <td>{new Date(r.sent_at).toLocaleString()}</td>
              <td>{r.broker_id}</td>
              <td>{r.to_address}</td>
              <td>{r.reply_to}</td>
              <td>
                <a class="text-blue-600 underline" href={`/thread/${r.id}`}>{r.reply_count}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}