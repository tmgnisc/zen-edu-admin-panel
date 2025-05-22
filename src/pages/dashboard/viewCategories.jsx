import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
} from "@material-tailwind/react";
import {
  FolderIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

function ViewCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ message: "", type: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
  });

  const showToastMessage = (message, type = "success") => {
    setToastMessage({ message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://zenedu.everestwc.com/api/job-categories/');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name,
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      name: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://zenedu.everestwc.com/api/job-categories/${editingCategory.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update category');
      }

      const updatedCategory = await response.json();
      setCategories(prev => prev.map(category => 
        category.id === editingCategory.id ? updatedCategory : category
      ));
      
      showToastMessage("Category updated successfully!", "success");
      setEditModalOpen(false);
    } catch (err) {
      console.error('Error updating category:', err);
      showToastMessage(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this category?`)) {
      try {
        const response = await fetch(`https://zenedu.everestwc.com/api/job-categories/${id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete category');
        }

        setCategories(prev => prev.filter(category => category.id !== id));
        showToastMessage("Category deleted successfully!", "success");
      } catch (err) {
        console.error('Error deleting category:', err);
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
        <Card className="max-w-2xl mx-auto border border-red-100 shadow-sm">
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
      <Card className="max-w-2xl mx-auto border border-blue-gray-100 shadow-sm">
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            All Job Categories
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="divide-y divide-blue-gray-50">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between py-3 px-2">
                <div className="flex items-center gap-3">
                  <FolderIcon className="h-5 w-5 text-blue-gray-500" />
                  <Typography variant="small" className="font-medium text-blue-gray-700">
                    {category.name}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <IconButton 
                    variant="text" 
                    color="blue-gray" 
                    onClick={() => handleEdit(category)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="text"
                    color="red"
                    onClick={() => handleDelete(category.id)}
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
        <DialogHeader>Edit Category</DialogHeader>
        <form onSubmit={handleEditSubmit}>
          <DialogBody>
            <Input
              label="Category Name"
              name="name"
              value={editFormData.name}
              onChange={handleEditChange}
              required
            />
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

export default ViewCategories;
