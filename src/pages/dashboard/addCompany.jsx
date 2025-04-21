import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button,
} from "@material-tailwind/react";

function AddCompany() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Company submitted:", formData);
    alert(`Company "${formData.name}" added! (API pending)`);

    // Reset form
    setFormData({
      name: "",
      location: "",
      description: "",
    });
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
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
            <div className="flex justify-end">
              <Button type="submit" color="blue">
                Add Company
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddCompany;
