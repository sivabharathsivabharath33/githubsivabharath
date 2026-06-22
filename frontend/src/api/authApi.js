import axiosInstance from "./axiosInstance";

export const customerLogin = async (loginData) => {
  const response = await axiosInstance.post("/auth/customer/login", loginData);
  return response.data;
};

export const customerRegister = async (registerData) => {
  const response = await axiosInstance.post("/auth/customer/register", registerData);
  return response.data;
};

export const agentLogin = async (loginData) => {
  const response = await axiosInstance.post("/auth/agent/login", loginData);
  return response.data;
};

export const adminLogin = async (loginData) => {
  const response = await axiosInstance.post("/auth/admin/login", loginData);
  return response.data;
};