import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import  PatientIcon  from './pages/dashboard/Patient/patient.png'; 
import  MedicineIcon  from './pages/dashboard/Tables/medicine.png'; 
import  StafIcon  from './pages/dashboard/Staff/staff.png'; 
import { Home, Profile, Medicines, Appointments, Patients } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";


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
        path: "/staff",
        element: <staff />,
      },
      {
        icon: <img src={PatientIcon} alt="Patient" {...icon} />,
        name: "Patient",
        path: "/patient",
        element: <Patients />,
      }

    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
