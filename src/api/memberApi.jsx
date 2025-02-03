import apiClient from "./apiClient";

export const createMember = (data) =>
  apiClient.post("/UserRegister", data).then((res) => res.data);
