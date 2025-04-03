import apiClient from "./apiClient";

export const storeUserprediction = (data) =>
  apiClient.post("/userprediction", data).then((res) => res.data);

export const getUserprediction = (data) =>
  apiClient.get("/userprediction/get", data).then((res) => res.data);

export const storeSubscriber = (data) =>
  apiClient.post("/subscriber/prediction/store", data).then((res) => res.data);

export const getSubscriber = () =>
  apiClient.get("/subscriber/prediction/get").then((res) => res.data);
