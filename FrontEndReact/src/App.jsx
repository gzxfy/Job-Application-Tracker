import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Registration from "./pages/registration_page"
import Login from "./pages/login_page"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App