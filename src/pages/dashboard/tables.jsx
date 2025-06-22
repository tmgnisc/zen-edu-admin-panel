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
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, EyeIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export function Tables() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

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

  const handleViewProfile = (application) => {
    setSelectedApplicant(application);
    setProfileModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      case 'reviewed':
        return 'blue';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const formatFieldValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'Not provided';
    }
    return value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
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
                            <MenuItem onClick={() => handleViewProfile(application)} className="flex items-center gap-2">
                              <EyeIcon className="h-4 w-4 text-blue-500" />
                              View Profile
                            </MenuItem>
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Applicant Profile Modal */}
      <Dialog open={profileModalOpen} handler={() => setProfileModalOpen(false)} size="xl">
        <DialogHeader className="flex items-center gap-3">
          <Avatar 
            src={selectedApplicant?.applicant.profile_picture || `https://ui-avatars.com/api/?name=${selectedApplicant?.applicant.full_name || selectedApplicant?.applicant.username}`} 
            alt={selectedApplicant?.applicant.full_name || selectedApplicant?.applicant.username} 
            size="md" 
            variant="rounded" 
          />
          <div>
            <Typography variant="h5">
              {selectedApplicant?.applicant.full_name || selectedApplicant?.applicant.username}
            </Typography>
            <Typography variant="small" color="blue-gray">
              {selectedApplicant?.applicant.email}
            </Typography>
          </div>
        </DialogHeader>
        <DialogBody divider className="max-h-[75vh] overflow-y-auto p-6">
          {selectedApplicant && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="md:col-span-2">
                <Typography variant="h6" color="blue-gray" className="mb-4 border-b border-blue-gray-100 pb-2">
                  Personal Information
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Full Name</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.full_name)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Username</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.username)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Email</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.email)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Phone Number</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.phone_number)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Gender</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.gender)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Marital Status</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.marital_status)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Nationality</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.nationality)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Current Location</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.current_location)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Preferred Job Location</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.preferred_job_location)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Languages</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.languages)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Driving License</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.driving_license)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Visa Status</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.visa_status)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Passport Expiry Date</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatDate(selectedApplicant.applicant.passport_expiry_date)}
                </Typography>
              </div>

              {/* Professional Information */}
              <div className="md:col-span-2">
                <Typography variant="h6" color="blue-gray" className="mb-4 mt-6 border-b border-blue-gray-100 pb-2">
                  Professional Information
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Highest Qualification</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.highest_qualification)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Years of Experience</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.years_of_experience)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Expected Salary</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {selectedApplicant.applicant.expected_salary && selectedApplicant.applicant.currency 
                    ? `${selectedApplicant.applicant.expected_salary} ${selectedApplicant.applicant.currency}`
                    : formatFieldValue(selectedApplicant.applicant.expected_salary)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Preferred Designation</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.preferred_designation)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Availability to Join</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.availability_to_join)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">LinkedIn URL</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {selectedApplicant.applicant.linkedin_url ? (
                    <a href={selectedApplicant.applicant.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">
                      {selectedApplicant.applicant.linkedin_url}
                    </a>
                  ) : (
                    formatFieldValue(selectedApplicant.applicant.linkedin_url)
                  )}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Certificate</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.certificate)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Verification Status</Typography>
                <Chip
                  value={selectedApplicant.applicant.is_verified ? "Verified" : "Not Verified"}
                  color={selectedApplicant.applicant.is_verified ? "green" : "red"}
                  variant="gradient"
                  className="w-fit"
                />
              </div>

              {/* Education & Experience */}
              <div className="md:col-span-2">
                <Typography variant="h6" color="blue-gray" className="mb-4 mt-6 border-b border-blue-gray-100 pb-2">
                  Education & Experience Details
                </Typography>
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Education Details</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.education_details)}
                </Typography>
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Past Employment Details</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatFieldValue(selectedApplicant.applicant.past_employment_details)}
                </Typography>
              </div>

              {/* Application Information */}
              <div className="md:col-span-2">
                <Typography variant="h6" color="blue-gray" className="mb-4 mt-6 border-b border-blue-gray-100 pb-2">
                  Application Information
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Applied Position</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {selectedApplicant.job.job_title}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Company</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {selectedApplicant.job.company.name}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Salary Range</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {selectedApplicant.job.salary_range}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Job Location</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {selectedApplicant.job.job_location}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Job Schedule</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {selectedApplicant.job.job_schedule}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Applied Date</Typography>
                <Typography variant="paragraph" className="text-blue-gray-800">
                  {formatDate(selectedApplicant.applied_at)}
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Application Status</Typography>
                <Chip
                  value={selectedApplicant.status}
                  color={getStatusColor(selectedApplicant.status)}
                  variant="gradient"
                  className="w-fit"
                />
              </div>

              {/* Documents */}
              <div className="md:col-span-2">
                <Typography variant="h6" color="blue-gray" className="mb-4 mt-6 border-b border-blue-gray-100 pb-2">
                  Documents
                </Typography>
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Profile Picture</Typography>
                {selectedApplicant.applicant.profile_picture ? (
                  <Avatar
                    src={selectedApplicant.applicant.profile_picture}
                    alt="Profile"
                    size="lg"
                    className="mt-2"
                  />
                ) : (
                  <Typography variant="paragraph" className="text-blue-gray-800">
                    Not provided
                  </Typography>
                )}
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Resume</Typography>
                {selectedApplicant.resume ? (
                  <Button
                    size="sm"
                    color="blue"
                    variant="outlined"
                    onClick={() => window.open(selectedApplicant.resume, '_blank')}
                    className="mt-2"
                  >
                    View Resume
                  </Button>
                ) : (
                  <Typography variant="paragraph" className="text-blue-gray-800">
                    Not provided
                  </Typography>
                )}
              </div>

              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 mb-1">Cover Letter</Typography>
                {selectedApplicant.cover_letter ? (
                  <Button
                    size="sm"
                    color="blue"
                    variant="outlined"
                    onClick={() => window.open(selectedApplicant.cover_letter, '_blank')}
                    className="mt-2"
                  >
                    View Cover Letter
                  </Button>
                ) : (
                  <Typography variant="paragraph" className="text-blue-gray-800">
                    Not provided
                  </Typography>
                )}
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setProfileModalOpen(false)}
            className="mr-1"
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Tables;
