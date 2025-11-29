import { type JSX } from 'react'
import { Navigate, BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import { configureAmplify } from './config/amplify'
import { awsConfig } from './config/aws'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AdminLogin } from './components/AdminLogin'
import { AdminPage } from './pages/AdminPage'
import { HomePage } from './pages/HomePage'

configureAmplify(
  awsConfig.userPoolId,
  awsConfig.userPoolClientId,
  awsConfig.apiUrl
)

const ProtectedRoute = ({children}: {children: JSX.Element}) => {
  const {user, loading} = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to='/login' replace />;
}

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        </AuthProvider> 
    </BrowserRouter>    
  )
}

export default App
