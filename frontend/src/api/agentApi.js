import axiosInstance from "./axiosInstance";

export const getAgentDashboard = async () => {
  const response = await axiosInstance.get("/agent/dashboard");
  return response.data;
};

export const getAgentQueue = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.status_filter) {
    params.append("status_filter", filters.status_filter);
  }

  if (filters.priority_filter) {
    params.append("priority_filter", filters.priority_filter);
  }

  const queryString = params.toString();
  const url = queryString ? `/agent/queue?${queryString}` : "/agent/queue";

  const response = await axiosInstance.get(url);
  return response.data;
};

export const getAgentTicketDetails = async (ticketId) => {
  const response = await axiosInstance.get(`/agent/tickets/${ticketId}`);
  return response.data;
};

export const getAgentTicketMessages = async (ticketId) => {
  const response = await axiosInstance.get(`/agent/tickets/${ticketId}/messages`);
  return response.data;
};

export const sendAgentReply = async (ticketId, message) => {
  const response = await axiosInstance.post(`/agent/tickets/${ticketId}/reply`, {
    message,
  });

  return response.data;
};

export const updateAgentTicketStatus = async (ticketId, status) => {
  const response = await axiosInstance.patch(`/agent/tickets/${ticketId}/status`, {
    status,
  });

  return response.data;
};

export const getAgentAISuggestion = async (ticketId) => {
  const response = await axiosInstance.post(`/agent/tickets/${ticketId}/ai-suggestion`);
  return response.data;
};