import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { toast } from "react-toastify";

export function ChangePassword() {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (form.new_password !== form.confirm_new_password) {
      toast.error("New passwords do not match");
      return false;
    }
    if (form.new_password.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
  
    if (!token) {
      toast.error("Unauthorized: Please log in again.");
      return;
    }
  
    try {
      setLoading(true);
      const response = await fetch('https://zenedu.everestwc.com/api/accounts/admin/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}` 
        },
        body: JSON.stringify(form),
      });
      console.log("Token from localStorage:", token);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
  
      toast.success("Password changed successfully!");
      setForm({
        old_password: "",
        new_password: "",
        confirm_new_password: "",
      });
    } catch (err) {
      console.error('Password change error:', err);
      toast.error(err.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="mt-12 mb-8 flex justify-center">
      <Card className="w-full max-w-[24rem] border border-blue-gray-100 shadow-sm">
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Change Password
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="password"
              name="old_password"
              label="Current Password"
              value={form.old_password}
              onChange={handleChange}
              required
              color="blue"
              crossOrigin=""
            />
            <Input
              type="password"
              name="new_password"
              label="New Password"
              value={form.new_password}
              onChange={handleChange}
              required
              color="blue"
              crossOrigin=""
            />
            <Input
              type="password"
              name="confirm_new_password"
              label="Confirm New Password"
              value={form.confirm_new_password}
              onChange={handleChange}
              required
              color="blue"
              crossOrigin=""
            />
            <Button 
              type="submit" 
              color="blue" 
              fullWidth
              disabled={loading}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </CardBody>
        <CardFooter className="pt-0">
          <Typography variant="small" className="mt-4 text-center text-blue-gray-500">
            Make sure to use a strong password that you can remember
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ChangePassword;