import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { useState } from "react"
import { getToken } from "./auth"
import Login from "./Login"
import VehicleDashboard from "./VehicleDashboard"
import "./App.css"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken())

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <VehicleDashboard
      onLogout={() => setIsLoggedIn(false)}
    />
  )
}

export default App