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
export const getFile = (filename) =>
  apiClient
    .get(`/${filename}`, { responseType: "blob" })
    .then((res) => res.data);
