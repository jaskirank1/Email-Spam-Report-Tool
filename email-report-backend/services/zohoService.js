import { ImapFlow } from 'imapflow';

export const checkZoho = async (testCode) => {
  const client = new ImapFlow({
    host: process.env.ZOHO_IMAP_HOST,
    port: Number(process.env.ZOHO_IMAP_PORT),
    secure: process.env.ZOHO_IMAP_TLS === 'true',
    auth: {
      user: process.env.ZOHO_IMAP_USER,
      pass: process.env.ZOHO_IMAP_PASS
    }
  });

  await client.connect();

  let result = { provider: 'Zoho', status: 'Not Received', folder: null };

  // Folders to check in Zoho Mail
  const foldersToCheck = ['Inbox', 'Spam'];

  for (const folder of foldersToCheck) {
    try {
      await client.mailboxOpen(folder);

      // Search emails by text in subject + body
      const uids = await client.search({ text: testCode });
      console.log(`Zoho Folder: ${folder} — Found UIDs:`, uids);

      if (uids.length > 0) {
        // Fetch envelope + body snippet if needed
        const messages = await client.fetch(uids, { envelope: true, source: true });
        result = { provider: 'Zoho', status: 'Delivered', folder };
        break; // stop checking once email is found
      }
    } catch (err) {
      console.error(`Error checking folder ${folder}:`, err);
    }
  }

  await client.logout();
  return result;

};
