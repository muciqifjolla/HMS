// App.jsx

import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Home_Page from "./pages/Main_Page/Home_Page";
import Login from "./pages/auth/Login/Login.jsx";
import Register from "./pages/auth/Register/Register.jsx"; // Import the Register component

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} /> {/* Add this route for the Auth layout */}
      <Route path="/homepage" element={<Home_Page />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> {/* Add this route for the Register component */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
