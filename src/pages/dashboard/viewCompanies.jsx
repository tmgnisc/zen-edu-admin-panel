import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
  Spinner,
  Avatar,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  BuildingOffice2Icon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

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

function ViewCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ message: "", type: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    industry: "",
    location: "",
    communication_preferences: true,
  });

  const showToastMessage = (message, type = "success") => {
    setToastMessage({ message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

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

  const handleEdit = (company) => {
    setEditingCompany(company);
    setEditFormData({
      name: company.name,
      description: company.description,
      industry: company.industry,
      location: company.location,
      communication_preferences: company.communication_preferences,
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
      const response = await fetch(`https://zenedu.everestwc.com/api/companies/${editingCompany.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update company');
      }

      const updatedCompany = await response.json();
      setCompanies(prev => prev.map(company => 
        company.id === editingCompany.id ? updatedCompany : company
      ));
      
      showToastMessage("Company updated successfully!", "success");
      setEditModalOpen(false);
    } catch (err) {
      console.error('Error updating company:', err);
      showToastMessage(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this company?`)) {
      try {
        const response = await fetch(`https://zenedu.everestwc.com/api/companies/${id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === "Cannot delete company because it is associated with existing jobs.") {
            throw new Error("Cannot delete company because it has associated jobs. Please delete the jobs first.");
          }
          throw new Error('Failed to delete company');
        }

        setCompanies(prev => prev.filter(company => company.id !== id));
        showToastMessage("Company deleted successfully!", "success");
      } catch (err) {
        console.error('Error deleting company:', err);
        showToastMessage(err.message, "error");
      }
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
        <Card className="max-w-3xl mx-auto border border-red-100 shadow-sm">
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
      <Card className="max-w-3xl mx-auto border border-blue-gray-100 shadow-sm">
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            All Companies
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="divide-y divide-blue-gray-50">
            {companies.map((company) => (
              <div key={company.id} className="flex items-center justify-between py-3 px-2">
                <div className="flex items-center gap-3">
                  {company.company_logo ? (
                    <Avatar
                      src={company.company_logo}
                      alt={company.name}
                      size="sm"
                      className="border-2 border-white"
                    />
                  ) : (
                    <BuildingOffice2Icon className="h-5 w-5 text-blue-gray-500" />
                  )}
                  <div>
                    <Typography variant="small" className="font-medium text-blue-gray-700">
                      {company.name}
                    </Typography>
                    <div className="flex flex-col">
                      <Typography variant="extra-small" className="text-xs text-blue-gray-400">
                        {company.location}
                      </Typography>
                      <Typography variant="extra-small" className="text-xs text-blue-gray-400">
                        Industry: {company.industry}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => handleEdit(company)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="text"
                    color="red"
                    onClick={() => handleDelete(company.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} handler={() => setEditModalOpen(false)}>
        <DialogHeader>Edit Company</DialogHeader>
        <form onSubmit={handleEditSubmit}>
          <DialogBody>
            <div className="grid gap-4">
              <Input
                label="Company Name"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                required
              />
              <Input
                label="Location"
                name="location"
                value={editFormData.location}
                onChange={handleEditChange}
                required
              />
              <Select
                label="Industry"
                name="industry"
                value={editFormData.industry}
                onChange={(value) => setEditFormData(prev => ({ ...prev, industry: value }))}
                required
              >
                {industryOptions.map((industry) => (
                  <Option key={industry} value={industry}>
                    {industry}
                  </Option>
                ))}
              </Select>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="communication_preferences"
                  checked={editFormData.communication_preferences}
                  onChange={handleEditChange}
                  className="rounded border-blue-gray-200 text-blue-500 focus:ring-blue-500"
                />
                <Typography variant="small" className="font-medium text-blue-gray-700">
                  Enable Communication Preferences
                </Typography>
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

export default ViewCompanies;
