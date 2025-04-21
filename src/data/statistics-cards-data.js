import {
  BriefcaseIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: BriefcaseIcon,
    title: "Active Job Listings",
    value: "1,245",
    footer: {
      color: "text-green-500",
      value: "+12%",
      label: "this month",
    },
  },
  {
    color: "gray",
    icon: UsersIcon,
    title: "Total Candidates",
    value: "5,800",
    footer: {
      color: "text-green-500",
      value: "+7%",
      label: "since last month",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "New Signups",
    value: "430",
    footer: {
      color: "text-red-500",
      value: "-5%",
      label: "this week",
    },
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    title: "Applications Submitted",
    value: "9,520",
    footer: {
      color: "text-green-500",
      value: "+18%",
      label: "this month",
    },
  },
];

export default statisticsCardsData;
