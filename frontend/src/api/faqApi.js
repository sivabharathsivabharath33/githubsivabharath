import axiosInstance from "./axiosInstance";

export const getFaqs = async () => {
  const response = await axiosInstance.get("/faqs/");
  return response.data;
};

export const searchFaqs = async (query) => {
  const response = await axiosInstance.get(`/faqs/search?q=${query}`);
  return response.data;
};