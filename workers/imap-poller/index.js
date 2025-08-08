import Imap from 'imap';
import { simpleParser } from 'mailparser';
import Database from 'better-sqlite3';

const dbPath = process.env.SQLITE_PATH || '/app/data/databroker.sqlite';
const db = new Database(dbPath);
const intervalMs = Number(process.env.IMAP_POLL_INTERVAL || 60) * 1000;

async function check() {
  const imap = new Imap({
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASS,
    host: process.env.IMAP_HOST,
    port: Number(process.env.IMAP_PORT || 993),
    tls: String(process.env.IMAP_SECURE) === 'true',
  });
  await new Promise((resolve, reject) => {
    imap.once('ready', resolve);
    imap.once('error', reject);
    imap.connect();
  });
  imap.openBox('INBOX', false, err => {
    if (err) {
      console.error(err);
      imap.end();
      return;
    }
    imap.search(['UNSEEN'], (err, results = []) => {
      if (err || results.length === 0) {
        imap.end();
        return;
      }
      const f = imap.fetch(results, { bodies: '' });
      f.on('message', msg => {
        let raw = '';
        msg.on('body', stream => {
          stream.on('data', c => {
            raw += c.toString('utf8');
          });
        });
        msg.once('end', async () => {
          try {
            const mail = await simpleParser(raw);
            const inReply = mail.inReplyTo || '';
            const toAddr = (mail.to?.text || '').toLowerCase();
            const findByMsg = db.prepare('SELECT id FROM sent_emails WHERE message_id = ?').get(inReply);
            const findByAlias = db.prepare('SELECT id FROM sent_emails WHERE reply_to = ?').get(toAddr);
            const sentId = (findByMsg && findByMsg.id) || (findByAlias && findByAlias.id) || null;
            db.prepare(
              `INSERT INTO replies (sent_email_id, from_address, subject, body) VALUES (?,?,?,?)`
            ).run(
              sentId,
              mail.from?.text || '',
              mail.subject || '',
              mail.text || mail.html || ''
            );
          } catch (e) {
            console.error('Parse/store error', e);
          }
        });
      });
      f.once('end', () => imap.end());
    });
  });
}

setInterval(check, intervalMs);
check();