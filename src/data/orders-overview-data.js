import {
  ClipboardDocumentCheckIcon,
  EyeIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

export const ordersOverviewData = [
  {
    icon: ClipboardDocumentCheckIcon,
    color: "text-blue-500",
    title: "New Applications",
    description: "120 new job applications received today",
  },
  {
    icon: EyeIcon,
    color: "text-yellow-500",
    title: "Under Review",
    description: "85 applications currently being reviewed",
  },
  {
    icon: CalendarDaysIcon,
    color: "text-indigo-500",
    title: "Interviews Scheduled",
    description: "42 interviews scheduled for this week",
  },
  {
    icon: CurrencyDollarIcon,
    color: "text-green-500",
    title: "Offers Made",
    description: "15 candidates received job offers",
  },
  {
    icon: UserCircleIcon,
    color: "text-purple-500",
    title: "Hires Confirmed",
    description: "7 new hires confirmed this month",
  },
];
