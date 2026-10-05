import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Register from "./pages/Register";
import Project from "./pages/Project";
import Issue from "./pages/Issue";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        <Route path="/projects"
          element={
            <ProtectedRoutes>
              <Project />
            </ProtectedRoutes>
          }
        />

        <Route path="/issues"
          element={
            <ProtectedRoutes>
              <Issue />
            </ProtectedRoutes>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;