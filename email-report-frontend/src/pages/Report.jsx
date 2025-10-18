import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getReport, checkTest } from '../services/api'
import { useTest } from '../context/TestContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ReportCard from '../components/ReportCard'
import './Report.css'

const Report = () => {
  const { code } = useParams()
  const { loading, setLoading, results, setResults } = useTest()

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        // Try immediate getReport first
        const data = await getReport(code)
        if (data && data.inboxes) {
          setResults(data.inboxes)
        } else {
          // fallback to check endpoint which triggers a fresh scan
          const res = await checkTest(code)
          setResults(res.results || res.inboxes)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [code])

  if (loading) return <LoadingSpinner />

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Deliverability Report — {code}</h2>
        <p>Below is where your email landed in each provider.</p>
      </div>

      <div className="report-grid">
        {results && results.length ? (
          results.map((r) => <ReportCard key={r.provider} item={r} />)
        ) : (
          <div className="no-results">No results yet. Try re-checking in a minute.</div>
        )}
      </div>
    </div>
  )
}

export default Report