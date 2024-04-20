
import { Routes, Route } from "react-router-dom";

import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController } from "@/context";

export function Dashboard() {

  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (

    <div className="min-h-screen bg-blue-gray-50/50">
      
      <Sidenav routes={routes} brandImg={ sidenavType === "blue" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png" }/>

        <div className="p-4 xl:ml-80">

          <DashboardNavbar />


          <Routes>
            {routes.map(
              ({ layout, pages }) =>
                layout === "dashboard" &&
                pages.map(({ path, element }) => (
                  <Route exact path={path} element={element} />
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
