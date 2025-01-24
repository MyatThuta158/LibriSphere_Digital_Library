import { apiClient } from "./apiClient";

//---------This is for create admin----//
export const createAdmin = (data) =>
  apiClient.post("/admins", data).then((res) => res.data);

///----------This get the admin data with pagination---//
export const getAdmin = (page) =>
  apiClient.get(`/admins?page=${page}`).then((res) => res.data);

////------This is for delete admin data---/////
export const deleteAdmin = (id) =>
  apiClient.delete(`/admins/${id}`).then((res) => res.data);
