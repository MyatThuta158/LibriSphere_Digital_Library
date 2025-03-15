import apiClient from "./apiClient";

export const storeUserprediction = (data) =>
  apiClient.post("/userprediction", data).then((res) => res.data);

export const getUserprediction = (data) =>
  apiClient.get("/userprediction/get", data).then((res) => res.data);
