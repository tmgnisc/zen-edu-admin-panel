import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
  Select,
  Option,
  Checkbox,
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const industryOptions = [
  "Information Technology",
  "Healthcare",
  "Construction",
  "Finance",
  "Retail",
  "Hospitality",
  "Education",
  "Real Estate",
  "Others"
];

const jobTypeOptions = [
  "Full Time",
  "Part Time",
  "Permanent",
  "Internship"
];

function AddJob() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [formData, setFormData] = useState({
    company: "",
    jobTitle: "",
    numberOfHires: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
    currency: "AED",
    jobDescription: "",
    emailUpdates: false,
    resumeRequired: true,
    coverLetterRequired: false,
    deadline: "",
    screeningQuestions: "",
    companyLogo: null,
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://zenedu.everestwc.com/api/companies/');
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data = await response.json();
      setCompanies(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCompanyChange = (companyId) => {
    const company = companies.find(c => c.id === parseInt(companyId));
    setSelectedCompany(company);
    setFormData(prev => ({
      ...prev,
      company: companyId
    }));
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage({ message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validation
    if (!formData.jobTitle || !formData.company || !formData.jobType || !formData.salaryMin || !formData.salaryMax || !formData.deadline || !formData.jobDescription) {
      showToastMessage("Please fill all required fields.", "error");
      setLoading(false);
      return;
    }
    if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      showToastMessage("Minimum salary cannot be greater than maximum salary.", "error");
      setLoading(false);
      return;
    }
    if (!formData.jobType) {
      showToastMessage("Please select a job type.", "error");
      setLoading(false);
      return;
    }
    try {
      const form = new FormData();
      form.append('job_title', formData.jobTitle);
      form.append('company_id', formData.company);
      form.append('salary_range', `${formData.salaryMin}-${formData.salaryMax} ${formData.currency}`);
      form.append('applications', 0);
      form.append('job_category_id', 2);
      form.append('job_type', formData.jobType);
      form.append('number_of_people', formData.numberOfHires);
      form.append('resume_required', formData.resumeRequired);
      form.append('cover_letter_required', formData.coverLetterRequired);
      form.append('deadline', formData.deadline);
      form.append('screening_questions', formData.screeningQuestions || '');
      form.append('job_description', formData.jobDescription);
      form.append('recruiter_ids', JSON.stringify([1])); // Send as JSON array string
      form.append('employer_id', 1);
      if (formData.companyLogo) {
        form.append('company_logo', formData.companyLogo);
      }
      for (let pair of form.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
      }
      const response = await fetch('https://zenedu.everestwc.com/api/jobs/', {
        method: 'POST',
        body: form,
      });
      if (!response.ok) {
        let errorMsg = 'Failed to create job';
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMsg = errorData.error;
          } else if (typeof errorData === 'string') {
            errorMsg = errorData;
          }
        } catch (e) {}
        throw new Error(errorMsg);
      }
      showToastMessage("Job added successfully!", "success");
      setFormData({
        company: "",
        jobTitle: "",
        numberOfHires: "",
        jobType: "",
        salaryMin: "",
        salaryMax: "",
        currency: "AED",
        jobDescription: "",
        emailUpdates: false,
        resumeRequired: true,
        coverLetterRequired: false,
        deadline: "",
        screeningQuestions: "",
        companyLogo: null,
      });
      setSelectedCompany(null);
    } catch (err) {
      showToastMessage(err.message, "error");
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
        <Card className="w-full border border-red-100 shadow-sm">
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
    <div className="mt-12 mb-8 w-full px-4">
      <Card className="w-full border border-blue-gray-100 shadow-sm">
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            Add New Job
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Information Section */}
            <div className="col-span-1 md:col-span-2">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Company Information
              </Typography>
            </div>
            
            <div className="col-span-1">
              <Select
                label="Select Company"
                value={formData.company}
                onChange={handleCompanyChange}
                required
              >
                {companies.map((company) => (
                  <Option key={company.id} value={company.id.toString()}>
                    {company.name}
                  </Option>
                ))}
              </Select>
            </div>

            {selectedCompany && (
              <>
                <div className="col-span-1 md:col-span-2">
                  <Typography variant="small" className="mb-2 font-medium text-blue-gray-600">
                    Company Description
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-600">
                    {selectedCompany.description}
                  </Typography>
                </div>

                <div className="col-span-1">
                  <Typography variant="small" className="mb-2 font-medium text-blue-gray-600">
                    Industry
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-600">
                    {selectedCompany.industry}
                  </Typography>
                </div>

                <div className="col-span-1">
                  <Typography variant="small" className="mb-2 font-medium text-blue-gray-600">
                    Location
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-600">
                    {selectedCompany.location}
                  </Typography>
                </div>
              </>
            )}

            {/* Job Details Section */}
            <div className="col-span-1 md:col-span-2">
              <Typography variant="h6" color="blue-gray" className="mb-4 mt-4">
                Job Details
              </Typography>
            </div>

            <Input
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />

            <Input
              label="Number of People to Hire"
              name="numberOfHires"
              type="number"
              value={formData.numberOfHires}
              onChange={handleChange}
              required
            />

            <div className="col-span-1">
              <Select
                label="Job Type"
                name="jobType"
                value={formData.jobType}
                onChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}
                required
              >
                {jobTypeOptions.map((type) => (
                  <Option key={type} value={type.toLowerCase().replace(' ', '_')}>
                    {type}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="col-span-1">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="Min Salary"
                  name="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
                <Input
                  label="Max Salary"
                  name="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
                <Select
                  label="Currency"
                  name="currency"
                  value={formData.currency}
                  onChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  className="w-full"
                >
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                  <Option value="GBP">GBP</Option>
                  <Option value="AED">AED</Option>
                </Select>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <Typography variant="small" className="mb-2 font-medium text-blue-gray-600">
                Job Description
              </Typography>
              <ReactQuill
                theme="snow"
                value={formData.jobDescription}
                onChange={value => setFormData(prev => ({ ...prev, jobDescription: value }))}
                placeholder="Enter job description..."
                className="bg-white rounded-md border border-blue-gray-200"
              />
            </div>

            {/* Application Preferences Section */}
            <div className="col-span-1 md:col-span-2">
              <Typography variant="h6" color="blue-gray" className="mb-4 mt-4">
                Application Preferences
              </Typography>
            </div>

            <div className="col-span-1 md:col-span-2">
              <Checkbox
                label="Send updates to Email"
                name="emailUpdates"
                checked={formData.emailUpdates}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-1">
              <Checkbox
                label="Resume Required"
                name="resumeRequired"
                checked={formData.resumeRequired}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-1">
              <Checkbox
                label="Cover Letter Required"
                name="coverLetterRequired"
                checked={formData.coverLetterRequired}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Application Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
            />

            <div className="col-span-1 md:col-span-2">
              <Typography variant="small" className="mb-2 font-medium text-blue-gray-600">
                Screening Questions
              </Typography>
              <textarea
                rows={3}
                name="screeningQuestions"
                value={formData.screeningQuestions}
                onChange={handleChange}
                placeholder="Enter screening questions (one per line)..."
                className="w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 text-sm text-blue-gray-700 outline-none focus:border-blue-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Typography variant="small" className="mb-2 font-medium text-blue-gray-600">
                Company Logo
              </Typography>
              <input
                type="file"
                name="companyLogo"
                accept="image/*"
                onChange={e => setFormData(prev => ({ ...prev, companyLogo: e.target.files[0] }))}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end">
              <Button type="submit" color="blue">
                Add Job
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

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

export default AddJob;
