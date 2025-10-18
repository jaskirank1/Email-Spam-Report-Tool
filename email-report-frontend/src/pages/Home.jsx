import React, { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { startTest, checkTest } from '../services/api'
import { useTest } from '../context/TestContext'
import './Home.css'

const testEmails = [
  'testingemail8910@gmail.com',
  'jktestingemail01@zohomail.in',
  'testingyahoo0201@yahoo.com',
  'testingoutlook01@outlook.com',
  'testmail123@mail.com'
]

const Home = () => {
  const { testCode, setTestCode, loading, setLoading } = useTest()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [report, setReport] = useState(null)
  const [checking, setChecking] = useState(false)
  const [copyMessage, setCopyMessage] = useState('');
  const [resultMessage, setResultMessage] = useState('')

  const handleStart = async () => {
    setMessage('')
    if (!email) return setMessage('Please enter your email address (for report).')
    try {
      setLoading(true)
      const res = await startTest(email)
      setTestCode(res.testCode || '')
      setMessage(
        'Test code generated. Send an email to test inboxes with this code in subject or body, then click "Check Results".'
      )
    } catch (err) {
      console.error(err)
      setMessage('Failed to start test. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckResults = async () => {
    if (!testCode) return setMessage('Please start a test first.')
    try {
      setChecking(true)
      const res = await checkTest({ code: testCode, email })
      setReport(res)
      setMessage('Report ready!')
    } catch (err) {
      console.error(err)
      setMessage('Failed to fetch report. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  const handleOpenReport = () => {
    if (report?.reportUrl) {
      window.open(report.reportUrl, '_blank')
    }
  }

  return (
    <div className="home-container">
      <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', color: '#2563eb', marginBottom: '20px' }}>
        Email Spam Report Tool
      </h1>

      <section className="section-card">
        <h2>Test Inboxes</h2>
        <p>Send your test email to the addresses below. Include the generated test code in the subject or body.</p>
        <div className="inbox-grid">
          {testEmails.map((email, idx) => (
            <div
              key={idx}
              className="inbox-box"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(email);
                  setCopyMessage(`Copied "${email}" to clipboard!`);
                  setTimeout(() => setCopyMessage(''), 2000);
                } catch (err) {
                  console.error('Failed to copy:', err);
                  setCopyMessage('Failed to copy email.');
                  setTimeout(() => setCopyMessage(''), 2000);
                }
              }}
              title="Click to copy"
            >
              {email}
            </div>
          ))}
        </div>

        {copyMessage && <div className="copy-message">{copyMessage}</div>}

      </section>

      <section className="section-card">
        <h2>Instructions</h2>
        <ol className="instructions-list">
          <li>Write the email you want to send from your email id to these 5 test email ids. Don't send emails yet.</li>
          <li>Click "Start Test" to generate a unique code. Add this code in subject or body, then send the email.</li>
          <li>Wait 30-40 seconds for the email to reach the inboxes, then click "Check Results" to see which folder received the email.</li>
          <li>Once the report is ready, click "View Report Generated" to check the generated report.</li>
        </ol>
      </section>

      <section className="section-card">
        <h2>Start Test</h2>
        <div className="input-group">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email to receive report"
          />
          <button onClick={handleStart} className="btn-start">Start Test</button>
        </div>

        {loading && <LoadingSpinner />}

        {testCode && <div className="test-code"><span>Test Code:</span> <span>{testCode}</span></div>}
        {message && <div className="message">{message}</div>}
      </section>

      <section className="section-card">
        <h2>Check Results</h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          After sending your email with the test code, click below to check results.
        </p>
        <div className="centered-buttons">
          <button onClick={handleCheckResults} disabled={checking} className="btn-check">
            {checking ? 'Checking...' : 'Check Results'}
          </button>
          {report?.reportUrl && (
            <button onClick={handleOpenReport} className="btn-report">
              View Report Generated
            </button>
          )}
        </div>

        {resultMessage && <div className="message">{resultMessage}</div>}
      </section>
    </div>
  )
}

export default Home
