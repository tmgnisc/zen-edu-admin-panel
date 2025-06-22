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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [formData, setFormData] = useState({
    company: "",
    jobTitle: "",
    numberOfHires: "",
    applications: "",
    jobCategory: "",
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
    benefits: {
      accommodation: false,
      bonus: false,
      transportation: false,
      food_allowance: false,
      incentive: false,
      others: ""
    },
    featured: false,
    jobLocation: "",
    jobSchedule: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchCompanies();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://zenedu.everestwc.com/api/job-categories/');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
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

  const handleBenefitsChange = (benefit, value) => {
    setFormData(prev => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        [benefit]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validation
    if (!formData.jobTitle || !formData.company || !formData.jobSchedule || !formData.jobCategory || !formData.salaryMin || !formData.salaryMax || !formData.deadline || !formData.jobDescription || !formData.jobLocation) {
      showToastMessage("Please fill all required fields.", "error");
      setLoading(false);
      return;
    }
    if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      showToastMessage("Minimum salary cannot be greater than maximum salary.", "error");
      setLoading(false);
      return;
    }
    if (!formData.jobSchedule) {
      showToastMessage("Please select a job schedule.", "error");
      setLoading(false);
      return;
    }
    if (!formData.jobCategory) {
      showToastMessage("Please select a job category.", "error");
      setLoading(false);
      return;
    }
    try {
      const form = new FormData();
      form.append('job_title', formData.jobTitle);
      form.append('company_id', formData.company);
      form.append('salary_range', `${formData.salaryMin}-${formData.salaryMax} ${formData.currency}`);
      form.append('applications', formData.applications);
      form.append('job_category_id', formData.jobCategory);
      form.append('number_of_people', formData.numberOfHires);
      form.append('resume_required', formData.resumeRequired);
      form.append('cover_letter_required', formData.coverLetterRequired);
      form.append('deadline', formData.deadline);
      form.append('screening_questions', formData.screeningQuestions || '');
      form.append('job_description', formData.jobDescription);
      form.append('is_active', true); // Keep job active by default
      form.append('benefits', JSON.stringify(formData.benefits));
      form.append('featured', formData.featured);
      form.append('job_location', formData.jobLocation);
      form.append('job_schedule', formData.jobSchedule);
      
      if (formData.companyLogo) {
        form.append('company_logo', formData.companyLogo);
      }
      
      const response = await fetch('https://zenedu.everestwc.com/api/jobs/', {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        let errorMsg = 'Failed to create job';
        try {
          const errorData = await response.json();
          // Log the full error from backend for better debugging
          console.error("Backend error:", errorData);
          if (errorData && typeof errorData === 'object') {
            // Display first error message from the backend response object
            const firstErrorKey = Object.keys(errorData)[0];
            errorMsg = `${firstErrorKey}: ${errorData[firstErrorKey]}`;
          } else if (typeof errorData === 'string') {
            errorMsg = errorData;
          }
        } catch (e) {
          errorMsg = response.statusText;
        }
        throw new Error(errorMsg);
      }

      showToastMessage("Job added successfully!", "success");
      setFormData({
        company: "",
        jobTitle: "",
        numberOfHires: "",
        applications: "",
        jobCategory: "",
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
        benefits: {
          accommodation: false,
          bonus: false,
          transportation: false,
          food_allowance: false,
          incentive: false,
          others: ""
        },
        featured: false,
        jobLocation: "",
        jobSchedule: "",
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

            <Input
              label="Number of Openings (Applications)"
              name="applications"
              type="number"
              value={formData.applications}
              onChange={handleChange}
              required
            />

            <div className="col-span-1">
              <Select
                label="Job Category"
                name="jobCategory"
                value={formData.jobCategory}
                onChange={(value) => setFormData(prev => ({ ...prev, jobCategory: value }))}
                required
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id.toString()}>
                    {category.name}
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

            {/* Job Location and Schedule Section */}
            <div className="col-span-1 md:col-span-2">
              <Typography variant="h6" color="blue-gray" className="mb-4 mt-4">
                Job Location and Schedule
              </Typography>
            </div>

            <div className="col-span-1">
              <Select
                label="Job Location"
                name="jobLocation"
                value={formData.jobLocation}
                onChange={(value) => setFormData(prev => ({ ...prev, jobLocation: value }))}
                required
              >
                <Option value="remote">Remote</Option>
                <Option value="onsite">On-Site</Option>
                <Option value="hybrid">Hybrid</Option>
              </Select>
            </div>

            <div className="col-span-1">
              <Select
                label="Job Schedule"
                name="jobSchedule"
                value={formData.jobSchedule}
                onChange={(value) => setFormData(prev => ({ ...prev, jobSchedule: value }))}
                required
              >
                <Option value="full_time">Full Time</Option>
                <Option value="part_time">Part Time</Option>
                <Option value="contract">Contract</Option>
                <Option value="internship">Internship</Option>
                <Option value="freelance">Freelance</Option>
              </Select>
            </div>

            {/* Benefits and Features Section */}
            <div className="col-span-1 md:col-span-2">
              <Typography variant="h6" color="blue-gray" className="mb-4 mt-4">
                Benefits & Features
              </Typography>
            </div>

            <div className="col-span-1 md:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Checkbox
                  label="Accommodation"
                  checked={formData.benefits.accommodation}
                  onChange={(e) => handleBenefitsChange('accommodation', e.target.checked)}
                />
                <Checkbox
                  label="Bonus"
                  checked={formData.benefits.bonus}
                  onChange={(e) => handleBenefitsChange('bonus', e.target.checked)}
                />
                <Checkbox
                  label="Transportation"
                  checked={formData.benefits.transportation}
                  onChange={(e) => handleBenefitsChange('transportation', e.target.checked)}
                />
                <Checkbox
                  label="Food Allowance"
                  checked={formData.benefits.food_allowance}
                  onChange={(e) => handleBenefitsChange('food_allowance', e.target.checked)}
                />
                <Checkbox
                  label="Incentive"
                  checked={formData.benefits.incentive}
                  onChange={(e) => handleBenefitsChange('incentive', e.target.checked)}
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <Checkbox
                label="Featured Job"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Input
                label="Other Benefits"
                name="otherBenefits"
                value={formData.benefits.others}
                onChange={(e) => handleBenefitsChange('others', e.target.value)}
                placeholder="e.g., Health insurance, gym membership"
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
