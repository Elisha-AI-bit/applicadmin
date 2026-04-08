import LandingPage from './components/LandingPage'
import FirebaseExample from './components/FirebaseExample'
import { AuthTest } from './components/AuthTest'
import { AdminManager } from './components/AdminManager'
import './App.css'

function App() {
  return (
    <div className="space-y-8">
      <LandingPage />
      <FirebaseExample />
      <AuthTest />
      <AdminManager />
    </div>
  )
}

export default App
