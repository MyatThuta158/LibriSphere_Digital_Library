import { apiClient } from "./apiClient";

//-----This is to create resource data----//
export const createResource = (data) =>
  apiClient.post("/resources", data).then((res) => res.data);

//-------This is to retrieve all digital reosurces from database--//
export const fetchResource = (page) =>
  apiClient.get(`/resources?page=${page}`).then((res) => res.data);

///----This is to retrieve detail information for digital resources---////
export const detailResource = (id) =>
  apiClient.get(`/resources/${id}`).then((res) => res.data);

// This is resource file get for digital file
export const search = (query) =>
  apiClient.get(`/resource/search?name=${query}`).then((res) => res.data);

//-----This is the retrieve for resource detail----///
export const detail = (id) =>
  apiClient.get(`/resource/${id}`).then((res) => res.data);

//-----This is the update function for resource----///
export const resourceUpdate = (id, data) =>
  apiClient.post(`/Admin/UpdateResource/${id}`, data).then((res) => res.data);
