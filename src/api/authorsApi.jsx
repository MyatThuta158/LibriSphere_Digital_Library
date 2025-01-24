import { apiClient } from "./apiClient";

//---------this get all authors from api---//
export const getAuthors = () =>
  apiClient.get("/authors").then((res) => res.data);

//--------This create new author---//
export const createAuthors = (data) =>
  apiClient.post("/authors", data).then((res) => res.data);

//--------This show author by id---//
export const showAuthors = (id) =>
  apiClient.get(`/authors/${id}`).then((res) => res.data);

//-------This is for update author----//
export const updateAuthors = (id, data) =>
  apiClient.put(`/authors/${id}`, data).then((res) => res.data);

//-------This is for delete author----//
export const deleteAuthors = (id) =>
  apiClient.delete(`/authors/${id}`).then((response) => response.data);
