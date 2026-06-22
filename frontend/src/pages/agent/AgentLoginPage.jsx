import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../../components/common/GlassCard";
import TextInput from "../../components/common/TextInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import { agentLogin } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const AgentLoginPage = () => {
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
      const data = await agentLogin(formData);
      login(data);
      navigate("/agent/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Agent login failed");
    }
  };

  return (
    <div className="min-h-screen page-bg flex items-center justify-center p-4 relative overflow-hidden">
      <GlassCard className="w-full max-w-[440px] p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-[#09152e] mb-6 shadow-sm">
            <span className="material-symbols-outlined text-white text-[32px]">
              support_agent
            </span>
          </div>

          <h1 className="text-[42px] leading-tight font-extrabold text-[#09152e] mb-1">
            Agent Portal
          </h1>
          <h2 className="text-xl font-semibold text-[#45464d]">
            Welcome Back
          </h2>
          <p className="text-sm text-[#45464d] mt-1 opacity-80">
            Sign in to manage your assigned queue
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="Agent Email"
            icon="mail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="agent@company.com"
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
        </form>
      </GlassCard>
    </div>
  );
};

export default AgentLoginPage;