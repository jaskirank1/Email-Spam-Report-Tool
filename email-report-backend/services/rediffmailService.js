import { ImapFlow } from 'imapflow';

export const checkRediff = async (testCode) => {
  const client = new ImapFlow({
    host: process.env.REDIFF_IMAP_HOST,
    port: Number(process.env.REDIFF_IMAP_PORT),
    secure: process.env.REDIFF_IMAP_TLS === 'true',
    auth: {
      user: process.env.REDIFF_IMAP_USER,
      pass: process.env.REDIFF_IMAP_PASS
    }
  });

  await client.connect();

  let result = { provider: 'RediffMail', status: 'Not Received', folder: null };
  const foldersToCheck = ['Inbox', 'Junk', 'Spam'];

  for (const folder of foldersToCheck) {
    await client.mailboxOpen(folder);
    const uids = await client.search({ text: testCode });
    console.log(`Rediff Folder: ${folder} — Found UIDs:`, uids);

    if (uids.length > 0) {
      await client.fetch(uids, { envelope: true });
      result = { provider: 'RediffMail', status: 'Delivered', folder };
      break;
    }
  }

  await client.logout();
  return result;
};
