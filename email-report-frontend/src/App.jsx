import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Report from './pages/Report'
import { TestProvider } from './context/TestContext'
import './App.css'

function App() {
  return (
    <TestProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report/:code" element={<Report />} />
          </Routes>
        </main>
      </div>
    </TestProvider>
  )
}

export default App
