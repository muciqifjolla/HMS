import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  // InformationCircleIcon,
  // ServerStackIcon,
  // RectangleStackIcon,
} from "@heroicons/react/24/solid";
import  PatientIcon  from './pages/dashboard/Patient/patient.png'; 
import Emergency_ContactIcon from './pages/dashboard/Emergency_Contact/em.png'; 
import  MedicineIcon  from './pages/dashboard/Tables/medicine.png'; 
import  StafIcon  from './pages/dashboard/Staff/staff.png'; 
import  DepartmentIcon  from './pages/dashboard/Department/department.png';
import Home_Page from "./pages/Main_Page/Home_Page";

import { Home, Profile, Medicines, Appointments,Staffs, Patients, Departments, Emergency_Contacts} from "@/pages/dashboard";
// import { SignIn, SignUp } from "@/pages/auth";


const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <img src={MedicineIcon} alt="medicine" {...icon} />,
        name: "medicine",
        path: "/medicines",
        element: <Medicines />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "appointments",
        path: "/appointments",
        element: <Appointments />,
      },
      {
        icon: <img src={StafIcon} alt="Staf" {...icon} />,
        name: "Staff",
        path: "/staffs",
        element: <Staffs />,
      },
      {
        icon: <img src={PatientIcon} alt="Patient" {...icon} />,
        name: "Patient",
        path: "/patient",
        element: <Patients />,
      },
      {
    
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
    </svg>
        ),
        name: "Emergency Contact",
        path: "/emergency_contact",
        element: <Emergency_Contacts />,
      },
      {
      icon: <img src={DepartmentIcon} alt="department" {...icon} />,
      name: "department",
      path: "/department",
      element: <Departments />,
    },
    
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
