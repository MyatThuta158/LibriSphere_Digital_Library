import apiClient from "./apiClient"; // Adjust the import path as necessary

export const createSubscription = (data) =>
  apiClient.post("/Subscription/Register", data).then((res) => res.data);
