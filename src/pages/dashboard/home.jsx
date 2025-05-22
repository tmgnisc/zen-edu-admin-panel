import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
  Spinner,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  BuildingOffice2Icon,
  BriefcaseIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
    totalCategories: 0,
  });
  const [companies, setCompanies] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch jobs
      const jobsResponse = await fetch('https://zenedu.everestwc.com/api/jobs/');
      const jobsData = await jobsResponse.json();
      
      // Fetch companies
      const companiesResponse = await fetch('https://zenedu.everestwc.com/api/companies/');
      const companiesData = await companiesResponse.json();
      
      // Fetch categories
      const categoriesResponse = await fetch('https://zenedu.everestwc.com/api/job-categories/');
      const categoriesData = await categoriesResponse.json();

      // Calculate statistics
      const totalApplications = jobsData.reduce((sum, job) => sum + job.applicant_count, 0);
      
      setStats({
        totalJobs: jobsData.length,
        totalCompanies: companiesData.length,
        totalApplications,
        totalCategories: categoriesData.length,
      });

      // Get recent companies (last 5)
      setCompanies(companiesData.slice(0, 5));
      
      // Get recent jobs (last 5)
      setRecentJobs(jobsData.slice(0, 5));

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12 mb-8 flex justify-center items-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 mb-8">
        <Card className="border border-red-100 shadow-sm">
          <CardBody>
            <Typography color="red" className="text-center">
              Error: {error}
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  const statisticsCardsData = [
    {
      color: "blue",
      icon: BriefcaseIcon,
      title: "Total Jobs",
      value: stats.totalJobs,
      footer: {
        color: "text-green-500",
        value: "+3%",
        label: "than last month",
      },
    },
    {
      color: "orange",
      icon: BuildingOffice2Icon,
      title: "Companies",
      value: stats.totalCompanies,
      footer: {
        color: "text-green-500",
        value: "+2%",
        label: "than last month",
      },
    },
    {
      color: "green",
      icon: UserGroupIcon,
      title: "Applications",
      value: stats.totalApplications,
      footer: {
        color: "text-red-500",
        value: "-2%",
        label: "than last month",
      },
    },
    {
      color: "blue-gray",
      icon: CurrencyDollarIcon,
      title: "Categories",
      value: stats.totalCategories,
      footer: {
        color: "text-green-500",
        value: "+5%",
        label: "than last month",
      },
    },
  ];

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, value, footer }) => (
          <Card key={title} className="border border-blue-gray-100 shadow-sm">
            <CardBody>
              <div className="flex items-center gap-4">
                {React.createElement(icon, {
                  className: "w-6 h-6 text-blue-500",
                })}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-1">
                    {title}
                  </Typography>
                  <Typography variant="h4" color="blue-gray">
                    {value}
                  </Typography>
                </div>
              </div>
              <Typography className="mt-4 flex items-center gap-1 text-sm font-normal text-blue-gray-600">
                <ArrowUpIcon className="h-3.5 w-3.5 text-green-500" />
                <strong>{footer.value}</strong>
                {footer.label}
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Featured Companies
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <strong>{stats.totalCompanies} companies</strong> actively hiring
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <Link to="/dashboard/view-companies">View All</Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/dashboard/add-company">Add Company</Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Company", "Industry", "Location", "Jobs"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-6 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companies.map((company, key) => {
                  const className = `py-3 px-5 ${
                    key === companies.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={company.id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          {company.company_logo ? (
                            <Avatar src={company.company_logo} alt={company.name} size="sm" />
                          ) : (
                            <Avatar
                              src={`https://ui-avatars.com/api/?name=${company.name}`}
                              alt={company.name}
                              size="sm"
                            />
                          )}
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {company.name}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {company.industry}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {company.location}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="w-10/12">
                          <Typography
                            variant="small"
                            className="mb-1 block text-xs font-medium text-blue-gray-600"
                          >
                            {company.jobs?.length || 0} jobs
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Recent Job Listings
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>{stats.totalJobs}</strong> total jobs posted
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {recentJobs.map((job, key) => (
              <div key={job.id} className="flex items-start gap-4 py-3">
                <div
                  className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                    key === recentJobs.length - 1 ? "after:h-0" : "after:h-4/6"
                  }`}
                >
                  <BriefcaseIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block font-medium"
                  >
                    {job.job_title}
                  </Typography>
                  <Typography
                    as="span"
                    variant="small"
                    className="text-xs font-medium text-blue-gray-500"
                  >
                    {job.company.name} • {job.job_type}
                  </Typography>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
