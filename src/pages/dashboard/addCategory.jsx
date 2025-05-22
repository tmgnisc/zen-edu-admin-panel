import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

function AddCategory() {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ message: "", type: "" });

  const showToastMessage = (message, type = "success") => {
    setToastMessage({ message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('https://zenedu.everestwc.com/api/job-categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: category.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      const data = await response.json();
      console.log("Category added:", data);
      showToastMessage(`Category "${category}" added successfully!`, "success");
      setCategory(""); // Reset the input
    } catch (error) {
      console.error('Error adding category:', error);
      showToastMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
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
            <Button 
              type="submit" 
              color="blue"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Adding...
                </>
              ) : (
                'Add'
              )}
            </Button>
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

export default AddCategory;
