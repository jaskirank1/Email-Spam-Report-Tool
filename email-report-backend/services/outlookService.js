import { ImapFlow } from 'imapflow';

export const checkOutlook = async (testCode) => {
  const client = new ImapFlow({
    host: process.env.OUTLOOK_IMAP_HOST,
    port: Number(process.env.OUTLOOK_IMAP_PORT),
    secure: process.env.OUTLOOK_IMAP_TLS === 'true',
    auth: {
      user: process.env.OUTLOOK_IMAP_USER,
      pass: process.env.OUTLOOK_IMAP_PASS
    }
  });

  await client.connect();

  let result = { provider: 'Outlook', status: 'Not Received', folder: null };
  const foldersToCheck = ['Inbox', 'Junk Email', 'Clutter'];

  for (const folder of foldersToCheck) {
    await client.mailboxOpen(folder);
    const uids = await client.search({ text: testCode });
    console.log(`Outlook Folder: ${folder} — Found UIDs:`, uids);
    if (uids.length > 0) {
      await client.fetch(uids, { envelope: true });
      result = { provider: 'Outlook', status: 'Delivered', folder };
      break;
    }
  }

  await client.logout();
  return result;
};