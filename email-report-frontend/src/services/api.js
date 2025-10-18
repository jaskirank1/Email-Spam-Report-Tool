import axios from 'axios'


const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/test'


export const startTest = async (userEmail) => {
  const res = await axios.post(`${API_BASE}/start`, { userEmail })   // using this post as we have to send email in req body and get does not have req body
  // const res = await axios.get(`${API_BASE}/start`, { userEmail })
  return res.data
}


export const checkTest = async ({code, email}) => {
  // const res = await axios.get(`${API_BASE}/check/${code}`)
  const res = await axios.post(`${API_BASE}/check/${code}`, { email })     // why post becuase we also need email id of user which needs to be passed from frontend only as we do not have a db rn that we fetch email from there 
  return res.data
}


export const getReport = async (code) => {
  const res = await axios.get(`${API_BASE}/report/${code}`)
  return res.data
}