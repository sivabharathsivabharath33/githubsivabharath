import axiosInstance from "./axiosInstance";

export const createTicket = async (ticketData) => {
  const response = await axiosInstance.post("/customer/tickets", ticketData);
  return response.data;
};

export const getMyTickets = async () => {
  const response = await axiosInstance.get("/customer/tickets");
  return response.data;
};

export const getTicketDetails = async (ticketId) => {
  const response = await axiosInstance.get(`/customer/tickets/${ticketId}`);
  return response.data;
};

export const getTicketMessages = async (ticketId) => {
  const response = await axiosInstance.get(`/customer/tickets/${ticketId}/messages`);
  return response.data;
};

export const sendCustomerMessage = async (ticketId, message) => {
  const response = await axiosInstance.post(`/customer/tickets/${ticketId}/messages`, {
    message,
  });

  return response.data;
};