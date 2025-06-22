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
  Checkbox,
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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ message: "", type: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editFormData, setEditFormData] = useState({
    job_title: "",
    job_description: "",
    salaryMin: "",
    salaryMax: "",
    currency: "AED",
    job_schedule: "",
    job_category_id: "",
    job_location: "",
    number_of_people: "",
    resume_required: true,
    cover_letter_required: false,
    deadline: "",
    screening_questions: "",
    benefits: {
      accommodation: false,
      bonus: false,
      transportation: false,
      food_allowance: false,
      incentive: false,
      others: "",
    },
    featured: false,
    company_logo: null,
  });

  const showToastMessage = (message, type = "success") => {
    setToastMessage({ message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    fetchJobs();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://zenedu.everestwc.com/api/job-categories/');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    
    // Parse salary_range
    const salaryMatch = job.salary_range.match(/(\d+)-(\d+)\s(.+)/);
    const salaryMin = salaryMatch ? salaryMatch[1] : "";
    const salaryMax = salaryMatch ? salaryMatch[2] : "";
    const currency = salaryMatch ? salaryMatch[3] : "AED";

    setEditFormData({
      job_title: job.job_title,
      job_description: job.job_description,
      salaryMin,
      salaryMax,
      currency,
      job_schedule: job.job_schedule,
      job_category_id: job.job_category.id.toString(),
      job_location: job.job_location,
      number_of_people: job.number_of_people,
      resume_required: job.resume_required,
      cover_letter_required: job.cover_letter_required,
      deadline: job.deadline.split('T')[0],
      screening_questions: job.screening_questions || "",
      benefits: job.benefits || { accommodation: false, bonus: false, transportation: false, food_allowance: false, incentive: false, others: "" },
      featured: job.featured,
      company_logo: null, // Reset logo on each edit
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

  const handleEditBenefitsChange = (benefit, value) => {
    setEditFormData(prev => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        [benefit]: value
      }
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const form = new FormData();
    form.append('job_title', editFormData.job_title);
    form.append('job_description', editFormData.job_description);
    form.append('salary_range', `${editFormData.salaryMin}-${editFormData.salaryMax} ${editFormData.currency}`);
    form.append('job_schedule', editFormData.job_schedule);
    form.append('job_category', editFormData.job_category_id);
    form.append('job_location', editFormData.job_location);
    form.append('number_of_people', editFormData.number_of_people);
    form.append('resume_required', editFormData.resume_required);
    form.append('cover_letter_required', editFormData.cover_letter_required);
    form.append('deadline', editFormData.deadline);
    form.append('screening_questions', editFormData.screening_questions);
    form.append('benefits', JSON.stringify(editFormData.benefits));
    form.append('featured', editFormData.featured);

    if (editFormData.company_logo) {
      form.append('company_logo', editFormData.company_logo);
    }

    try {
      const response = await fetch(`https://zenedu.everestwc.com/api/jobs/${editingJob.id}/`, {
        method: 'PATCH',
        body: form,
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
          <DialogBody divider className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto p-6">
            
              <Input
                label="Job Title"
                name="job_title"
                value={editFormData.job_title}
                onChange={handleEditChange}
                required
              />

              <div className="md:col-span-2">
                <Typography variant="small" className="mb-2 font-medium text-blue-gray-600">Job Description</Typography>
                <Textarea
                  name="job_description"
                  value={editFormData.job_description}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <Input
                label="Min Salary"
                name="salaryMin"
                type="number"
                value={editFormData.salaryMin}
                onChange={handleEditChange}
                required
              />
              <Input
                label="Max Salary"
                name="salaryMax"
                type="number"
                value={editFormData.salaryMax}
                onChange={handleEditChange}
                required
              />
              <Select
                label="Currency"
                name="currency"
                value={editFormData.currency}
                onChange={(value) => setEditFormData(prev => ({ ...prev, currency: value }))}
              >
                <Option value="USD">USD</Option>
                <Option value="EUR">EUR</Option>
                <Option value="GBP">GBP</Option>
                <Option value="AED">AED</Option>
                <Option value="NRs">NRs</Option>
              </Select>
              
              <Select
                label="Job Category"
                name="job_category_id"
                value={editFormData.job_category_id}
                onChange={(value) => setEditFormData(prev => ({ ...prev, job_category_id: value }))}
                required
              >
                {categories.map(cat => <Option key={cat.id} value={cat.id.toString()}>{cat.name}</Option>)}
              </Select>

              <Select
                label="Job Schedule"
                name="job_schedule"
                value={editFormData.job_schedule}
                onChange={(value) => setEditFormData(prev => ({ ...prev, job_schedule: value }))}
                required
              >
                <Option value="full_time">Full Time</Option>
                <Option value="part_time">Part Time</Option>
                <Option value="contract">Contract</Option>
                <Option value="internship">Internship</Option>
                <Option value="freelance">Freelance</Option>
              </Select>
              
              <Select
                label="Job Location"
                name="job_location"
                value={editFormData.job_location}
                onChange={(value) => setEditFormData(prev => ({ ...prev, job_location: value }))}
                required
              >
                <Option value="onsite">On-Site</Option>
                <Option value="remote">Remote</Option>
                <Option value="hybrid">Hybrid</Option>
              </Select>

              <Input
                label="Number of People to Hire"
                name="number_of_people"
                type="number"
                value={editFormData.number_of_people}
                onChange={handleEditChange}
                required
              />
              <Input
                label="Application Deadline"
                name="deadline"
                type="date"
                value={editFormData.deadline}
                onChange={handleEditChange}
                required
              />

              <div className="md:col-span-2">
                <Typography variant="small" className="mb-2 font-medium text-blue-gray-600">Screening Questions</Typography>
                <Textarea
                  name="screening_questions"
                  value={editFormData.screening_questions}
                  onChange={handleEditChange}
                />
              </div>
              
              <div className="md:col-span-2">
                <Typography variant="h6" color="blue-gray" className="mb-2">Benefits</Typography>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Checkbox label="Accommodation" checked={editFormData.benefits.accommodation} onChange={(e) => handleEditBenefitsChange('accommodation', e.target.checked)} />
                  <Checkbox label="Bonus" checked={editFormData.benefits.bonus} onChange={(e) => handleEditBenefitsChange('bonus', e.target.checked)} />
                  <Checkbox label="Transportation" checked={editFormData.benefits.transportation} onChange={(e) => handleEditBenefitsChange('transportation', e.target.checked)} />
                  <Checkbox label="Food Allowance" checked={editFormData.benefits.food_allowance} onChange={(e) => handleEditBenefitsChange('food_allowance', e.target.checked)} />
                  <Checkbox label="Incentive" checked={editFormData.benefits.incentive} onChange={(e) => handleEditBenefitsChange('incentive', e.target.checked)} />
                </div>
              </div>

              <div className="md:col-span-2">
                <Input label="Other Benefits" name="others" value={editFormData.benefits.others} onChange={(e) => handleEditBenefitsChange('others', e.target.value)} />
              </div>

              <div className="md:col-span-2 flex flex-wrap items-center gap-6">
                <Checkbox label="Resume Required" name="resume_required" checked={editFormData.resume_required} onChange={handleEditChange} />
                <Checkbox label="Cover Letter Required" name="cover_letter_required" checked={editFormData.cover_letter_required} onChange={handleEditChange} />
                <Checkbox label="Featured Job" name="featured" checked={editFormData.featured} onChange={handleEditChange} />
              </div>
              
              <div className="md:col-span-2">
                <Typography variant="small" className="mb-2 font-medium text-blue-gray-600">Company Logo</Typography>
                <Input type="file" name="company_logo" onChange={(e) => setEditFormData(prev => ({ ...prev, company_logo: e.target.files[0] }))} />
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
