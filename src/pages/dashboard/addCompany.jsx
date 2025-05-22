import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button,
  Select,
  Option,
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

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

function AddCompany() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    location: "",
    communication_preferences: true,
  });
  const [companyLogo, setCompanyLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCompanyLogo(file);
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage({ message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append company logo if selected
      if (companyLogo) {
        formDataToSend.append('company_logo', companyLogo);
      }

      const response = await fetch('https://zenedu.everestwc.com/api/companies/', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create company');
      }

      const data = await response.json();
      console.log("Company created:", data);
      showToastMessage("Company added successfully!", "success");

      // Reset form
      setFormData({
        name: "",
        description: "",
        industry: "",
        location: "",
        communication_preferences: true,
      });
      setCompanyLogo(null);
      // Reset file input
      e.target.reset();
    } catch (err) {
      console.error('Error creating company:', err);
      setError(err.message);
      showToastMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 mb-8">
      <Card className="max-w-4xl mx-auto border border-blue-gray-100 shadow-sm">
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            Add New Company
          </Typography>
        </CardHeader>
        <CardBody>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Typography color="red" className="text-sm">
                Error: {error}
              </Typography>
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <Input
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <Select
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
              required
            >
              {industryOptions.map((industry) => (
                <Option key={industry} value={industry}>
                  {industry}
                </Option>
              ))}
            </Select>
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="communication_preferences"
                checked={formData.communication_preferences}
                onChange={handleChange}
                className="rounded border-blue-gray-200 text-blue-500 focus:ring-blue-500"
              />
              <Typography variant="small" className="font-medium text-blue-gray-700">
                Enable Communication Preferences
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="mb-2 font-medium text-blue-gray-700">
                Company Logo
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit" 
                color="blue"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Adding Company...
                  </>
                ) : (
                  'Add Company'
                )}
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

export default AddCompany;
