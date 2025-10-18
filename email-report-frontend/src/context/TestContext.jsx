import React, { createContext, useContext, useState } from 'react'


const TestContext = createContext()


export const TestProvider = ({ children }) => {
  const [testCode, setTestCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)


  return (
    <TestContext.Provider value={{ testCode, setTestCode, loading, setLoading, results, setResults }}>
      {children}
    </TestContext.Provider>
  )
}


export const useTest = () => useContext(TestContext)