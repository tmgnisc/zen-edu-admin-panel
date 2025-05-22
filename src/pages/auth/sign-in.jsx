import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "/img/logo-ct.png";

function SignIn() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://zenedu.everestwc.com/api/accounts/admin/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data = await response.json();
      
      // Store user data in localStorage
      const userData = {
        email: form.email,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
        token: data.token // Store the token if the API returns one
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      toast.success("Login successful!");
      navigate("/dashboard/home");
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white px-4">
      <Card className="w-full max-w-md border border-blue-gray-100 shadow-md">
        <CardHeader
          floated={false}
          shadow={false}
          className="mb-2 flex flex-col items-center bg-white"
        >
          <img src={Logo} alt="Zen Career Hub Logo" className="h-14 w-auto" />
          <Typography variant="h5" className="mt-3 text-blue-gray-800 font-semibold">
            Admin Login
          </Typography>
        </CardHeader>

        <CardBody className="flex flex-col gap-4 pt-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              name="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              required
              color="blue"
              crossOrigin=""
            />
            <Input
              type="password"
              name="password"
              label="Password"
              value={form.password}
              onChange={handleChange}
              required
              color="blue"
              crossOrigin=""
            />
            <div className="flex items-center justify-between">
              <Checkbox
                name="remember"
                label="Remember me"
                checked={form.remember}
                onChange={handleChange}
                color="blue"
                crossOrigin=""
              />
              <Typography
                variant="small"
                className="text-sm text-blue-500 hover:underline cursor-pointer"
              >
                Forgot password?
              </Typography>
            </div>
            <Button type="submit" color="blue" fullWidth>
              Sign In
            </Button>
          </form>
        </CardBody>

        <CardFooter className="pt-2 text-center">
          <Typography variant="small" className="text-blue-gray-600">
            © {new Date().getFullYear()} Zen Career Hub. All rights reserved.
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignIn;
