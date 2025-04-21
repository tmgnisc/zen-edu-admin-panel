import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";

function AddCategory() {
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category.trim()) return;

    console.log("New Category:", category); // ✅ Replace with API call later
    alert(`Category "${category}" added! (API integration pending)`);
    setCategory(""); // Reset the input
  };

  return (
    <div className="mt-12 mb-8">
      <Card className="max-w-xl mx-auto border border-blue-gray-100 shadow-sm">
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            Add New Category
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <Input
              label="Category Name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="flex-grow"
            />
            <Button type="submit" color="blue">
              Add
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddCategory;
