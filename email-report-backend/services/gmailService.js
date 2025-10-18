import { ImapFlow } from 'imapflow';

export const checkGmail = async (testCode) => {
  const client = new ImapFlow({
    host: process.env.GMAIL_IMAP_HOST,
    port: Number(process.env.GMAIL_IMAP_PORT),
    secure: process.env.GMAIL_IMAP_TLS === 'true',
    auth: {
      user: process.env.GMAIL_IMAP_USER,
      pass: process.env.GMAIL_IMAP_PASS
    }
  });

  await client.connect();

  let result = { provider: 'Gmail', status: 'Not Received', folder: null };

  // Always-existing folders in Gmail
  const foldersToCheck = ['INBOX', '[Gmail]/Spam', '[Gmail]/All Mail'];

  for (const folder of foldersToCheck) {
    try {
      await client.mailboxOpen(folder);

      // Search emails by text in subject + body
      const uids = await client.search({ text: testCode });
      console.log(`Folder: ${folder} — Found UIDs:`, uids);

      if (uids.length > 0) {
        // Fetch envelope + body snippet if needed
        await client.fetch(uids, { envelope: true, source: true });
        result = { provider: 'Gmail', status: 'Delivered', folder };
        break;
      }
    } catch (err) {
      console.warn(`Folder "${folder}" could not be opened. Skipping.`, err.message);
    }
  }

  await client.logout();
  return result;
};