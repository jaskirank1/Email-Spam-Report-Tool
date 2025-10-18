import React from 'react'
import './TestInboxes.css'

const INBOXES = [
  { id: 'gmail', name: 'Gmail', address: 'test.gmail@example.com' },
  { id: 'outlook', name: 'Outlook', address: 'test.outlook@example.com' },
  { id: 'yahoo', name: 'Yahoo', address: 'test.yahoo@example.com' },
  { id: 'proton', name: 'ProtonMail', address: 'test.proton@example.com' },
  { id: 'icloud', name: 'iCloud', address: 'test.icloud@example.com' },
]

const TestInboxes = () => {
  return (
    <div className="inbox-container">
      {INBOXES.map((box) => (
        <div key={box.id} className="inbox-card">
          <h4 className="inbox-name">{box.name}</h4>
          <p className="inbox-address">{box.address}</p>
        </div>
      ))}
    </div>
  )
}

export default TestInboxes