import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Home_Page from "./pages/Main_Page/Home_Page";
import Login from "./pages/Login/Login.jsx";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      {/* <Route path="/auth/register/*" element={<Auth />} /> */}
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/homepage" element={<Home_Page />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;

