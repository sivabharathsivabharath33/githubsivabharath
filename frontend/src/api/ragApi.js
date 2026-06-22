import axiosInstance from "./axiosInstance";

export const askKnowledgeBase = async (question) => {
  const response = await axiosInstance.post("/rag/ask", {
    question,
  });

  return response.data;
};