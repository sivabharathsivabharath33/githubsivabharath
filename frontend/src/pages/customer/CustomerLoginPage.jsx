import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassCard from "../../components/common/GlassCard";
import TextInput from "../../components/common/TextInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import { customerLogin } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const CustomerLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await customerLogin(formData);
      login(data);
      navigate("/tickets");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4 relative overflow-hidden">
      <GlassCard className="w-full max-w-[440px] p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-[#09152e] mb-6 shadow-sm">
            <span className="material-symbols-outlined text-white text-[32px]">
              support_agent
            </span>
          </div>

          <h1 className="text-[42px] leading-tight font-extrabold text-[#09152e] mb-1">
            SmartDesk
          </h1>
          <h2 className="text-xl font-semibold text-[#45464d]">
            Customer Login
          </h2>
          <p className="text-sm text-[#45464d] mt-1 opacity-80">
            Sign in to create and track your support tickets
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="••••••••"
            required
          />

          <PrimaryButton type="submit">
            Login
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </PrimaryButton>

          <div className="text-center text-sm">
            <span className="text-[#45464d]">New to SmartDesk? </span>
            <Link
              to="/register"
              className="text-[#09152e] font-bold hover:text-[#372800]"
            >
              Register Here
            </Link>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default CustomerLoginPage;