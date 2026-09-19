import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Registration from "./pages/registration_page"
import Login from "./pages/login_page"
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App