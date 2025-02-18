import apiClient from "./apiClient"; // Adjust the import path as necessary

export const createReview = (data) =>
  apiClient.post("/Reviews/Add", data).then((res) => res.data);

//----------This route is to show all reviews related to resource-------//
export const resourceReviews = (id) =>
  apiClient.get(`/Resource/Reviews/${id}`).then((res) => res.data);
