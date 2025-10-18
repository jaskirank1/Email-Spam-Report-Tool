import { generateTestCode } from '../utils/codeGenerator.js';
import { getTestInboxes, sendReportEmail } from '../utils/emailUtils.js';
import { checkGmail } from '../services/gmailService.js';
import { checkOutlook } from '../services/outlookService.js';
import { checkYahoo } from '../services/yahooService.js';
import { checkRediff } from '../services/rediffmailService.js';
import { checkZoho } from '../services/zohoService.js';
import fs from 'fs';
import path from 'path';

/**
 * POST /api/test/start
 * body: { "email": "userEmail@example.com" }
 * returns { testCode, inboxes }
 */
export const startTest = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const testCode = generateTestCode();
    return res.json({ message: 'Test Code created', testCode });
  } catch (err) {
    console.error('startTest function error, failed to generate test code', err);
    return res.status(500).json({ error: 'Failed to generate Test code - function startTest' });
  }
};

/**
 * POST /api/test/check/:code
 * Triggers scanning the test inboxes and returns results.
 */

// without db ->
export const checkResults = async (req, res) => {
  const { code } = req.params;
  const { email } = req.body;
  try {
    const inboxList = getTestInboxes(); // returns env mapped list

    // Check all inboxes sequentially
    const results = [];
    for (const box of inboxList) {
      const envPrefix = box.envKey;
      const providerKey = (envPrefix || '').toLowerCase();
      let r;

      if (providerKey.startsWith('gmail')) {
        r = await checkGmail(code);
      }

      if (providerKey.startsWith('zoho')) {
        r = await checkZoho(code);
      }

      // if (providerKey.startsWith('yahoo')) {
      //   r = await checkYahoo(code);
      // }

      // if (providerKey.startsWith('outlook') || providerKey.startsWith('office')) {
      //   console.log("-------------------------------------Entered test Controller outlook ------------------------------------")
      //   r = await checkOutlook(code);
      //   console.log("-------------------------------------Done with check Outlook function  ------------------------------------")
      // }

      // if (providerKey.startsWith('rediff')) {
      //   r = await checkRediff(code);
      // }

      if (!r) {
        r = { provider: box.provider, address: box.address, status: 'Not Received', folder: null };
      }

      results.push({
        ...r,
        address: box.address
      });
    }

    // Compute score — count how many reached Inbox
    const inboxCount = results.filter(r => r.status === 'Inbox' || r.status === 'Delivered').length;
    const score = Math.round((inboxCount / results.length) * 100);

    // Generate sharable HTML report
    const reportDir = path.join(process.cwd(), "reports");
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);

    const reportHtml = `
      <html>
      <head>
        <title>Deliverability Report - ${code}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #fafafa; }
          h2 { color: #2563eb; }
          table { border-collapse: collapse; width: 100%; margin-top: 15px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; }
        </style>
      </head>
      <body>
        <h2>Deliverability Report</h2>
        <p><b>Test Code:</b> ${code}</p>
        <p><b>Score:</b> ${score}%</p>
        <p><b>Generated:</b> ${new Date().toLocaleString()}</p>
        <table>
          <tr><th>Provider</th><th>Address</th><th>Status</th><th>Folder</th></tr>
          ${results
        .map(
          (r) =>
            `<tr>
                  <td>${r.provider}</td>
                  <td>${r.address}</td>
                  <td>${r.status}</td>
                  <td>${r.folder || "-"}</td>
                </tr>`
        )
        .join("")}
        </table>
        <p style="margin-top:20px;color:#666;">Generated automatically by Deliverability Test System.</p>
      </body>
      </html>
    `;

    const filePath = path.join(reportDir, `${code}.html`);
    fs.writeFileSync(filePath, reportHtml);

    const frontendBase =
      process.env.FRONTEND_BASE_URL || "http://localhost:3000";
    const backendBase = process.env.BACKEND_BASE_URL || "http://localhost:5000";
    const reportUrl = `${backendBase}/reports/${code}.html`;

    // Send email to user (if provided)
    if (email) {
      try {
        await sendReportEmail({
          to: email,
          subject: `Your Deliverability Report (${code})`,
          html: `
        <h3>Your Deliverability Report is Ready</h3>
        <p>Score: <b>${score}%</b></p>
        <p>View full report here: <a href="${reportUrl}" target="_blank">${reportUrl}</a></p>
      `,
        });
        console.log(`Report emailed successfully to ${email}`);
      } catch (err) {
        console.warn('Email sending failed:', err.message);
      }
    }

    // Send response back to frontend
    return res.json({
      message: "Analysis complete",
      results,
      score,
      reportUrl,
    });
  } catch (err) {
    console.error("checkResults error", err);
    return res
      .status(500)
      .json({ error: "Failed to check results", details: err.message });
  }
};



/**
 * GET /api/test/report/:code
 * returns stored report if exists
 */
export const getReport = async (req, res) => {
  try {
    const { code } = req.params;
    const filePath = path.join(process.cwd(), 'reports', `${code}.html`);

    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, 'utf8');
      res.set('Content-Type', 'text/html');
      return res.send(html);
    } else {
      return res.status(404).send('<h3>Report not found. Please re-check after a few minutes.</h3>');
    }
  } catch (err) {
    console.error('getReport error', err);
    return res.status(500).send('Failed to fetch report.');
  }
};

