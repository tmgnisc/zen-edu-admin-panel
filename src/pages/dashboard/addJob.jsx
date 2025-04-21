import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
  Select,
  Option,
  Slider,
  Checkbox,
} from "@material-tailwind/react";
import categoryList from "@/data/categories";

const recruiterOptions = [
  { name: "Romina Hadid", img: "/img/team-1.jpeg" },
  { name: "Ryan Tompson", img: "/img/team-2.jpeg" },
  { name: "Jessica Doe", img: "/img/team-3.jpeg" },
  { name: "Alexander Smith", img: "/img/team-4.jpeg" },
];

function AddJob() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    salary: "",
    applications: "",
 description: "",
 category: "",
    recruiters: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleRecruiterToggle = (name) => {
    setFormData((prev) => {
      const exists = prev.recruiters.includes(name);
      const recruiters = exists
        ? prev.recruiters.filter((r) => r !== name)
        : [...prev.recruiters, name];
      return { ...prev, recruiters };
    });
  };

  const handleCategoryChange = (val) => {
    setFormData((prev) => ({ ...prev, category: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build recruiter objects with image for display (same format as ViewJobs)
    const finalData = {
      ...formData,
      recruiters: recruiterOptions
        .filter((r) => formData.recruiters.includes(r.name))
        .map((r) => ({ name: r.name, img: r.img })),
    };

    console.log("Submitted Job:", finalData);
    alert("Job added! (Check console for data)");
    // Reset
    setFormData({
      title: "",
      company: "",
      salary: "",
      applications: "",
description: "",
category: "",
      recruiters: [],
    });
  };

  return (
    <div className="mt-12 mb-8">
      <Card className="mx-auto max-w-4xl border border-blue-gray-100 shadow-sm">
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            Add New Job
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Input
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
            <Input
              label="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
            <Input
              label="Applications"
              name="applications"
              type="number"
              value={formData.applications}
              onChange={handleChange}
              required
            />
<div className="col-span-1 md:col-span-2">
  <Typography variant="small" className="mb-2 font-medium text-blue-gray-600">
    Job Category
  </Typography>
  <Select
    label="Select a Category"
    value={formData.category}
    onChange={handleCategoryChange}
    required
  >
    {categoryList.map((cat) => (
      <Option key={cat} value={cat}>
        {cat}
      </Option>
    ))}
  </Select>
</div>



            <div className="col-span-1 md:col-span-2">
  <Typography variant="small" className="mb-2 font-medium text-blue-gray-600">
    Job Description
  </Typography>
  <textarea
    rows={5}
    name="description"
    value={formData.description}
    onChange={handleChange}
    placeholder="Enter job description..."
    className="w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 text-sm text-blue-gray-700 outline-none focus:border-blue-500"
    required
  />
</div>

          
            <div className="col-span-1 md:col-span-2">
              <Typography variant="small" className="mb-2 font-medium text-blue-gray-600">
                Select Recruiters
              </Typography>
              <div className="flex flex-wrap gap-4">
                {recruiterOptions.map((r) => (
                  <Checkbox
                    key={r.name}
                    label={r.name}
                    checked={formData.recruiters.includes(r.name)}
                    onChange={() => handleRecruiterToggle(r.name)}
                  />
                ))}
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <Button type="submit" color="blue">
                Add Job
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddJob;
