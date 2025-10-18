import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';

/**
 * Connects to an IMAP server and searches specified folders for an email containing the testCode.
 * Returns object: { found: boolean, folder: string|null, date: Date|null, raw: { headers, subject, uid } }
 */
export const searchCodeInFolders = async ({ host, port, tls, user, password, folders = ['INBOX'], testCode, searchTimeout = 20000 }) => {
  const config = {
    imap: {
      user,
      password,
      host,
      port,
      tls,
      authTimeout: 20000,
      // debug: console.log
    }
  };

  let conn;
  try {
    conn = await imaps.connect(config);

    // iterate folders in order
    for (const folder of folders) {
      try {
        await conn.openBox(folder);
      } catch (err) {
        // folder may not exist
        continue;
      }

      // Search: subject OR body contains code OR header contains code
      const searchCriteria = [
        ['OR', ['HEADER', 'SUBJECT', testCode], ['BODY', testCode]]
      ];

      const fetchOptions = {
        bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
        markSeen: false
      };

      const results = await conn.search(searchCriteria, fetchOptions);

      if (results && results.length > 0) {
        // pick newest
        const msg = results[results.length - 1];
        const all = msg.parts.find(p => p.which === 'TEXT') || {};
        const headerPart = msg.parts.find(p => /HEADER/i.test(p.which));
        const raw = headerPart ? headerPart.body : {};

        // parse body optionally
        let parsed;
        try {
          parsed = await simpleParser(all.body || '');
        } catch (e) {
          parsed = null;
        }

        // For Gmail special labels might be in msg.attributes?.x-gm-labels or attributes.labels
        const attrs = msg.attributes || {};
        const labels = attrs['x-gm-labels'] || attrs['labels'] || attrs['x-gm-raw'] || [];

        // Prepare returned info
        return {
          found: true,
          folder,
          date: new Date(raw.DATE || parsed?.date || Date.now()),
          raw: { headers: raw, subject: raw.SUBJECT || (parsed && parsed.subject), labels: labels }
        };
      }
    }

    return { found: false };
  } catch (err) {
    // bubbled error
    throw err;
  } finally {
    if (conn) {
      try { await conn.end(); } catch (e) {}
    }
  }
};
