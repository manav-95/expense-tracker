import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layout/Layout"
import Dashboard from "./pages/Dashboard"
import GetReport from "./pages/GetReport"
import Transactions from "./pages/Transactions"
import GetStarted from "./pages/GetStarted"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

import { AnalysisContextProvider } from '../src/contexts/AnalysisContext'
import { TransactionContextProvider } from "./contexts/TransactionContext"
import { AuthContextProvider } from "./contexts/AuthContext"

function App() {

  return (
    <>
      <AuthContextProvider>
        <AnalysisContextProvider>
          <TransactionContextProvider>
            <BrowserRouter>
              <Routes>
                {/* Authentication Routes */}
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Dashboard Routes */}
                <Route path="/" element={<Layout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="get-report" element={<GetReport />} />
                  <Route path="transactions" element={<Transactions />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TransactionContextProvider>
        </AnalysisContextProvider>
      </AuthContextProvider>
    </>
  )
}

export default App
