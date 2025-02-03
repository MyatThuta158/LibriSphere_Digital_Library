import apiClient from "./apiClient"; // Adjust the import path as necessary

export const createReview = (data) =>
  apiClient.post("/Reviews/Add", data).then((res) => res.data);
