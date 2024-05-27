import { Routes, Route } from "react-router-dom";
import ProtectedRoute from '../ProtectedRoute';
import Cookies from 'js-cookie'; // Import js-cookie

import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController } from "@/context";

export function Dashboard() {
  const userRole = Cookies.get('role'); // Get user role from cookies

  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav routes={routes} brandImg={ sidenavType === "blue" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png" }/>

      <div className="p-4 xl:ml-80">
        <DashboardNavbar />

        <Routes>
          {routes.map(({ layout, pages }) =>
            layout === 'dashboard' &&
            pages.map(({ path, element, allowedRoles }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute
                    element={element}
                    allowedRoles={allowedRoles}
                    userRole={userRole}
                  />
                }
              />
            ))
          )}
        </Routes>

        <div className="text-blue-gray-600">
          <Footer />
        </div>
        
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
