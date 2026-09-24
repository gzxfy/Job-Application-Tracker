import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Registration from "./pages/registration_page"
import Login from "./pages/login_page"
import Dashboard from "./pages/Dashboard";
import CreateApplication from "./pages/create_application_page";
import ViewDetailedApplication from "./pages/view_detailed_application_page";

// Defines the client-side routes; Flask still owns the matching /api endpoints.
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/applications/new" element={<CreateApplication />} />
          <Route path="/applications/:applicationId" element={<ViewDetailedApplication />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App