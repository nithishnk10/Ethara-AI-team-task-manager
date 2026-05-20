import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Login />}
      />
      <Route
          path="/login"
          element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
          path="/admin"
          element={
              <ProtectedRoute
                  allowedRole="admin"
              >
                  <AdminDashboard />
              </ProtectedRoute>
          }
      />

      <Route
          path="/member"
          element={
              <ProtectedRoute
                  allowedRole="member"
              >
                  <MemberDashboard />
              </ProtectedRoute>
          }
      />

    </Routes>

  );
}

export default App;