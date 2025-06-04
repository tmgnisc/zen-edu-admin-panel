import {
  HomeIcon,
  BriefcaseIcon,
  Squares2X2Icon,
  PlusCircleIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/solid";

import { Home } from "@/pages/dashboard";
import {Tables} from "@/pages/dashboard"
import ViewJobs from "./pages/dashboard/viewJobs";
import AddJob from "./pages/dashboard/addJob";
import ViewCategories from "./pages/dashboard/viewCategories";
import Placeholder from "@/components/Placeholder"; 
import AddCategory from "./pages/dashboard/addCategory";
import ViewCompanies from "./pages/dashboard/viewCompanies";
import AddCompany from "./pages/dashboard/addCompany";
import ProtectedRoute from "@/components/ProtectedRoute";

const icon = {
  className: "w-5 h-5 text-inherit",
};

const protectedRoutes = [
  {
    icon: <HomeIcon {...icon} />,
    name: "Dashboard",
    path: "/home",
    element: <Home />,
  },
  {
    icon: <BriefcaseIcon {...icon} />,
    name: "All Jobs",
    path: "/jobs",
    element: <ViewJobs/>,
  },
  {
    icon: <PlusCircleIcon {...icon} />,
    name: "Add Job",
    path: "/jobs/add",
    element: <AddJob />,
  },
  {
    icon: <Squares2X2Icon {...icon} />,
    name: "All Categories",
    path: "/categories",
    element: <ViewCategories/>,
  },
  {
    icon: <PlusCircleIcon {...icon} />,
    name: "Add Category",
    path: "/categories/add",
    element: <AddCategory />,
  },
  {
    icon: <UserGroupIcon {...icon} />,
    name: "Applicants",
    path: "/applicants",
    element: <Tables/>,
  },
  {
    icon: <BuildingOffice2Icon {...icon} />,
    name: "Companies",
    path: "/companies",
    element: <ViewCompanies />,
  },
  {
    icon: <PlusCircleIcon {...icon} />,
    name: "Add Company",
    path: "/companies/add",
    element: <AddCompany/>,
  },
];

export const routes = [
  {
    layout: "dashboard",
    pages: protectedRoutes.map(route => ({
      ...route,
      element: <ProtectedRoute>{route.element}</ProtectedRoute>
    })),
  },
];

export default routes;
