import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Home_Page from "./pages/Main_Page/Home_Page";
function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      {/* <Route path="/Main_Page/Home_Page*" element={<Home_Page />} /> */}
    </Routes>
  );
}

export default App;
