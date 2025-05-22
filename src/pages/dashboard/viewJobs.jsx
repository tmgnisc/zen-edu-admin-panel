import React, { useState, useEffect } from "react";
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
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import {
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

function ViewJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ message: "", type: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editFormData, setEditFormData] = useState({
    job_title: "",
    job_description: "",
    salary_range: "",
    job_type: "",
    number_of_people: "",
    resume_required: true,
    cover_letter_required: true,
    deadline: "",
    screening_questions: "",
  });

  const showToastMessage = (message, type = "success") => {
    setToastMessage({ message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://zenedu.everestwc.com/api/jobs/');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setEditFormData({
      job_title: job.job_title,
      job_description: job.job_description,
      salary_range: job.salary_range,
      job_type: job.job_type,
      number_of_people: job.number_of_people,
      resume_required: job.resume_required,
      cover_letter_required: job.cover_letter_required,
      deadline: job.deadline.split('T')[0],
      screening_questions: job.screening_questions,
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://zenedu.everestwc.com/api/jobs/${editingJob.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update job');
      }

      const updatedJob = await response.json();
      setJobs(prev => prev.map(job => 
        job.id === editingJob.id ? updatedJob : job
      ));
      
      showToastMessage("Job updated successfully!", "success");
      setEditModalOpen(false);
    } catch (err) {
      console.error('Error updating job:', err);
      showToastMessage(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const response = await fetch(`https://zenedu.everestwc.com/api/jobs/${id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete job');
        }

        setJobs(prev => prev.filter(job => job.id !== id));
        showToastMessage("Job deleted successfully!", "success");
      } catch (err) {
        console.error('Error deleting job:', err);
        showToastMessage(err.message, "error");
      }
    }
  };

  const toggleStatus = async (id, newStatus) => {
    try {
      const job = jobs.find(j => j.id === id);
      const isActive = newStatus === "Open";
  
      const response = await fetch(`https://zenedu.everestwc.com/api/jobs/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_title: job.job_title,
          job_description: job.job_description,
          salary_range: job.salary_range,
          job_type: job.job_type,
          number_of_people: job.number_of_people,
          resume_required: job.resume_required,
          cover_letter_required: job.cover_letter_required,
          deadline: job.deadline,
          screening_questions: job.screening_questions,
          is_active: isActive,
          company: job.company.id, // Only the ID, not object
          job_category: job.job_category.id // Only the ID
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData); // Helpful for debugging
        throw new Error('Failed to update job status');
      }
  
      const updatedJob = await response.json();
      setJobs(prev => prev.map(job => job.id === id ? updatedJob : job));
      showToastMessage(`Job marked as ${newStatus.toLowerCase()}!`, "success");
    } catch (err) {
      console.error('Error updating job status:', err);
      showToastMessage(err.message, "error");
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
                {["Title", "Company", "Category", "Salary", "Applications", "Status", ""].map(
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
              {jobs.map((job, key) => {
                const className = `py-3 px-5 ${
                  key === jobs.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={job.id}>
                    <td className={className}>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {job.job_title}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        {job.company.company_logo && (
                          <Avatar
                            src={job.company.company_logo}
                            alt={job.company.name}
                            size="xs"
                            variant="circular"
                            className="border-2 border-white"
                          />
                        )}
                        <Typography variant="small" className="text-sm text-blue-gray-600">
                          {job.company.name}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography variant="small" className="text-sm text-blue-gray-600">
                        {job.job_category.name}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography variant="small" className="text-xs text-blue-gray-600">
                        {job.salary_range}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography variant="small" className="text-xs text-blue-gray-600">
                        {job.applicant_count}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        value={job.is_active ? "Open" : "Closed"}
                        color={job.is_active ? "green" : "blue-gray"}
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
                            onClick={() => toggleStatus(job.id, job.is_active ? "Closed" : "Open")}
                            className="flex items-center gap-2"
                          >
                            {job.is_active ? (
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
                            onClick={() => handleEdit(job)}
                            className="flex items-center gap-2"
                          >
                            <PencilIcon className="h-4 w-4 text-blue-500" />
                            Edit Job
                          </MenuItem>

                          <MenuItem
                            onClick={() => handleDelete(job.id)}
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

      {/* Edit Modal */}
      <Dialog open={editModalOpen} handler={() => setEditModalOpen(false)} size="lg">
        <DialogHeader>Edit Job</DialogHeader>
        <form onSubmit={handleEditSubmit}>
          <DialogBody>
            <div className="grid gap-4">
              <Input
                label="Job Title"
                name="job_title"
                value={editFormData.job_title}
                onChange={handleEditChange}
                required
              />
              <Textarea
                label="Job Description"
                name="job_description"
                value={editFormData.job_description}
                onChange={handleEditChange}
                required
              />
              <Input
                label="Salary Range"
                name="salary_range"
                value={editFormData.salary_range}
                onChange={handleEditChange}
                required
              />
              <Select
                label="Job Type"
                name="job_type"
                value={editFormData.job_type}
                onChange={(value) => setEditFormData(prev => ({ ...prev, job_type: value }))}
                required
              >
                <Option value="full_time">Full Time</Option>
                <Option value="part_time">Part Time</Option>
                <Option value="contract">Contract</Option>
                <Option value="internship">Internship</Option>
              </Select>
              <Input
                label="Number of People"
                name="number_of_people"
                type="number"
                value={editFormData.number_of_people}
                onChange={handleEditChange}
                required
              />
              <Input
                label="Deadline"
                name="deadline"
                type="date"
                value={editFormData.deadline}
                onChange={handleEditChange}
                required
              />
              <Textarea
                label="Screening Questions"
                name="screening_questions"
                value={editFormData.screening_questions}
                onChange={handleEditChange}
              />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="resume_required"
                    checked={editFormData.resume_required}
                    onChange={handleEditChange}
                    className="rounded border-blue-gray-200 text-blue-500 focus:ring-blue-500"
                  />
                  <Typography variant="small" className="font-medium text-blue-gray-700">
                    Resume Required
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="cover_letter_required"
                    checked={editFormData.cover_letter_required}
                    onChange={handleEditChange}
                    className="rounded border-blue-gray-200 text-blue-500 focus:ring-blue-500"
                  />
                  <Typography variant="small" className="font-medium text-blue-gray-700">
                    Cover Letter Required
                  </Typography>
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => setEditModalOpen(false)}
              className="mr-1"
            >
              Cancel
            </Button>
            <Button type="submit" color="blue">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`flex items-center gap-2 p-4 rounded-lg shadow-lg ${
              toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              <ExclamationCircleIcon className="h-5 w-5" />
            )}
            <Typography variant="small" className="font-normal">
              {toastMessage.message}
            </Typography>
            <IconButton
              variant="text"
              color="white"
              size="sm"
              onClick={() => setShowToast(false)}
            >
              <XMarkIcon className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewJobs;
