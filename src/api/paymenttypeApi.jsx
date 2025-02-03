import apiClient from "./apiClient";

export const createPayment = (data) =>
  apiClient.post("/payment_types", data).then((res) => res.data);

export const getPayment = () =>
  apiClient.get("/Memberships/Payments").then((res) => res.data);
