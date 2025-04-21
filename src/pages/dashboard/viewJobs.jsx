import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Tooltip,
  Chip,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import initialJobs from "@/data/view-jobs";
import {
 
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";


function ViewJobs() {
  const [jobs, setJobs] = useState(initialJobs);

  const toggleStatus = (id, newStatus) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, status: newStatus } : job
      )
    );
  };

  return (
    <div className="mt-12 mb-8">
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Job Listings
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Title", "Company", "Recruiters", "Salary", "Applications", "Status", ""].map(
                  (el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {jobs.map(({ id, title, company, recruiters, salary, applications, status }, key) => {
                const className = `py-3 px-5 ${
                  key === jobs.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={id}>
                    <td className={className}>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {title}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography variant="small" className="text-sm text-blue-gray-600">
                        {company}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex -space-x-2">
                        {recruiters.map((rec, i) => (
                          <Tooltip key={i} content={rec.name}>
                            <Avatar
                              src={rec.img}
                              alt={rec.name}
                              size="xs"
                              variant="circular"
                              className="border-2 border-white"
                            />
                          </Tooltip>
                        ))}
                      </div>
                    </td>
                    <td className={className}>
                      <Typography variant="small" className="text-xs text-blue-gray-600">
                        {salary}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography variant="small" className="text-xs text-blue-gray-600">
                        {applications}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        value={status}
                        color={status === "Open" ? "green" : "blue-gray"}
                        variant="gradient"
                        className="text-xs py-0.5 px-2"
                      />
                    </td>
                    <td className={className}>
                      <Menu placement="left-start">
                        <MenuHandler>
                          <IconButton variant="text">
                            <EllipsisVerticalIcon className="h-5 w-5 text-blue-gray-400" />
                          </IconButton>
                        </MenuHandler>
                        <MenuList>
  <MenuItem
    onClick={() => toggleStatus(id, status === "Open" ? "Closed" : "Open")}
    className="flex items-center gap-2"
  >
    {status === "Open" ? (
      <>
        <LockClosedIcon className="h-4 w-4 text-blue-gray-500" />
        Mark as Closed
      </>
    ) : (
      <>
        <LockOpenIcon className="h-4 w-4 text-green-600" />
        Mark as Open
      </>
    )}
  </MenuItem>

  <MenuItem
    onClick={() => alert(`Edit job ${id}`)}
    className="flex items-center gap-2"
  >
    <PencilIcon className="h-4 w-4 text-blue-500" />
    Edit Job
  </MenuItem>

  <MenuItem
    onClick={() => {
      if (confirm("Are you sure you want to delete this job?")) {
        setJobs((prev) => prev.filter((job) => job.id !== id));
      }
    }}
    className="text-red-500 flex items-center gap-2"
  >
    <TrashIcon className="h-4 w-4" />
    Delete Job
  </MenuItem>
</MenuList>


                      </Menu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default ViewJobs;
