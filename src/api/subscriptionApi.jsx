import apiClient from "./apiClient";

export const createSubscription = (data) =>
  apiClient.post("/Subscription/Register", data).then((res) => res.data);

// This is to fetch all payments to approve and view detail
export const viewMemberpayment = () =>
  apiClient.get("/AllPayments").then((res) => res.data);

// This get to show detail payment and subscription information to AdminRoute
export const detailInfoPayment = (id) =>
  apiClient.get(`/subscriptions/${id}`).then((res) => res.data);

export const changeStatus = (id, status) =>
  apiClient.put(`/subscriptions/status/${id}`, status).then((res) => res.data);


