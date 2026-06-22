import axiosInstance from "./axiosInstance";

// Dashboard
export const getAdminDashboard = async () => {
  const response = await axiosInstance.get("/admin/dashboard");
  return response.data;
};

// Users
export const getAdminUsers = async () => {
  const response = await axiosInstance.get("/admin/users");
  return response.data;
};

export const updateUserStatus = async (userId, statusValue) => {
  const response = await axiosInstance.patch(
    `/admin/users/${userId}/status?status_value=${statusValue}`
  );
  return response.data;
};

// Agents
export const getAdminAgents = async () => {
  const response = await axiosInstance.get("/admin/agents");
  return response.data;
};

export const createAgent = async (agentData) => {
  const response = await axiosInstance.post("/admin/agents", agentData);
  return response.data;
};

export const updateAgent = async (agentId, agentData) => {
  const response = await axiosInstance.patch(`/admin/agents/${agentId}`, agentData);
  return response.data;
};

export const deleteAgent = async (agentId) => {
  const response = await axiosInstance.delete(`/admin/agents/${agentId}`);
  return response.data;
};

// FAQs
export const getAdminFaqs = async () => {
  const response = await axiosInstance.get("/admin/faqs");
  return response.data;
};

export const createFaq = async (faqData) => {
  const response = await axiosInstance.post("/admin/faqs", faqData);
  return response.data;
};

export const updateFaq = async (faqId, faqData) => {
  const response = await axiosInstance.patch(`/admin/faqs/${faqId}`, faqData);
  return response.data;
};

export const deleteFaq = async (faqId) => {
  const response = await axiosInstance.delete(`/admin/faqs/${faqId}`);
  return response.data;
};

// Knowledge Base
export const uploadKbDocument = async (formData) => {
  const response = await axiosInstance.post("/admin/kb/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getKbDocuments = async () => {
  const response = await axiosInstance.get("/admin/kb/documents");
  return response.data;
};

export const deleteKbDocument = async (documentId) => {
  const response = await axiosInstance.delete(`/admin/kb/documents/${documentId}`);
  return response.data;
};

// Tickets
export const getAdminTickets = async () => {
  const response = await axiosInstance.get("/admin/tickets");
  return response.data;
};