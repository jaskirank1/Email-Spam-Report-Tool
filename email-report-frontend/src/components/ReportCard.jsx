import React from 'react'
import './ReportCard.css'

const ReportCard = ({ item }) => {
  const getStatusClass = (status) => {
    if (status === 'Inbox') return 'status-inbox'
    if (status === 'Spam') return 'status-spam'
    return 'status-other'
  }

  return (
    <div className="report-card">
      <div className="report-header">
        <div className="report-info">
          <div className="report-provider">{item.provider}</div>
          <div className="report-address">{item.address || ''}</div>
        </div>
        <div className={`report-status ${getStatusClass(item.status)}`}>{item.status}</div>
      </div>
    </div>
  )
}

export default ReportCard