import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import GlassCard from "../../components/common/GlassCard";
import TextInput from "../../components/common/TextInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import { customerRegister } from "../../api/authApi";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    employee_id: "",
    department: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await customerRegister(formData);
      setSuccess("Registration successful. Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4 py-10">
      <GlassCard className="w-full max-w-[560px] p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-[#09152e] mb-5 shadow-sm">
            <span className="material-symbols-outlined text-white text-[32px]">
              person_add
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-[#09152e] mb-1">
            Create Account
          </h1>

          <p className="text-[#45464d] text-sm">
            Register to create and track your service tickets
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            label="Full Name"
            icon="person"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <TextInput
            label="Work Email"
            icon="mail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
          />

          <TextInput
            label="Password"
            icon="lock"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create password"
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <TextInput
              label="Employee ID"
              icon="badge"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              placeholder="EMP001"
            />

            <TextInput
              label="Department"
              icon="business"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Engineering"
            />
          </div>

          <TextInput
            label="Phone"
            icon="call"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
          />

          <PrimaryButton type="submit">
            Register
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </PrimaryButton>

          <div className="text-center text-sm">
            <span className="text-[#45464d]">Already have an account? </span>
            <Link to="/login" className="text-[#09152e] font-bold">
              Login Here
            </Link>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default RegisterPage;