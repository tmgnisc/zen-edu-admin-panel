import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export function Tables() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://zenedu.everestwc.com/api/applications');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId); // Start loading for this application
      const response = await fetch(`https://zenedu.everestwc.com/api/applications/${applicationId}/status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update application status');
      }
  
      await fetchApplications();
      toast.success(`Application marked as ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.message);
    } finally {
      setUpdatingId(null); // Done loading
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      case 'reviewed':
        return 'blue';
      default:
        return 'blue-gray';
    }
  };

  return (
    <div className="mt-12 mb-8">
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Applications
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Candidate", "Position", "Status", "Applied On", ""].map((el) => (
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
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((application, key) => {
                const className = `py-3 px-5 ${
                  key === applications.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={application.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar 
                          src={application.applicant.profile_picture || `https://ui-avatars.com/api/?name=${application.applicant.full_name || application.applicant.username}`} 
                          alt={application.applicant.full_name || application.applicant.username} 
                          size="sm" 
                          variant="rounded" 
                        />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {application.applicant.full_name || application.applicant.username}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {application.applicant.email}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {application.job.job_title}
                      </Typography>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {application.job.company.name}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={getStatusColor(application.status)}
                        value={application.status}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {new Date(application.applied_at).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Menu placement="left-start">
                      {updatingId === application.id ? (
  <Spinner className="h-5 w-5 text-blue-500" />
) : (
  <Menu placement="left-start">
    <MenuHandler>
      <IconButton variant="text">
        <EllipsisVerticalIcon className="h-5 w-5 text-blue-gray-400" />
      </IconButton>
    </MenuHandler>
    <MenuList>
      <MenuItem onClick={() => handleStatusChange(application.id, 'accepted')}>
        Mark as Accepted
      </MenuItem>
      <MenuItem onClick={() => handleStatusChange(application.id, 'rejected')}>
        Mark as Rejected
      </MenuItem>
      <MenuItem onClick={() => handleStatusChange(application.id, 'reviewed')}>
        Mark as Reviewed
      </MenuItem>
      <MenuItem onClick={() => window.open(application.resume, '_blank')}>
        View Resume
      </MenuItem>
      {application.cover_letter && (
        <MenuItem onClick={() => window.open(application.cover_letter, '_blank')}>
          View Cover Letter
        </MenuItem>
      )}
    </MenuList>
  </Menu>
)}

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

export default Tables;
