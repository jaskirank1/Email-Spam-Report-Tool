import { ImapFlow } from 'imapflow';

export const checkYahoo = async (testCode) => {
  const client = new ImapFlow({
    host: process.env.YAHOO_IMAP_HOST,
    port: Number(process.env.YAHOO_IMAP_PORT),
    secure: process.env.REDIFF_IMAP_TLS === 'true',
    auth: {
      user: process.env.YAHOO_IMAP_USER,
      pass: process.env.YAHOO_IMAP_PASS
    }
  });

  await client.connect();

  let result = { provider: 'Yahoo', status: 'Not Received', folder: null };
  const foldersToCheck = ['INBOX', 'Spam', 'Bulk'];

  for (const folder of foldersToCheck) {
    await client.mailboxOpen(folder);
    const uids = await client.search({ text: testCode });
    console.log(`Yahoo Folder: ${folder} — Found UIDs:`, uids);

    if (uids.length > 0) {
      await client.fetch(uids, { envelope: true });
      result = { provider: 'Yahoo', status: 'Delivered', folder };
      break;
    }
  }

  await client.logout();
  return result;
};