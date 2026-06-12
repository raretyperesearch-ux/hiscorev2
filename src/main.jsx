import React from 'react'
import ReactDOM from 'react-dom/client'
import HiScore from './App.jsx'
import Plink from './Plink.jsx'

const App = window.location.pathname.startsWith('/plink') ? Plink : HiScore

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
