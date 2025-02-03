import apiClient from "./apiClient";

export const createMembership = (data) =>
  apiClient.post("/memberships", data).then((res) => res.data);

//----This is to show all genre----//
export const getMembership = () =>
  apiClient.get("/Memberships/show").then((res) => res.data);
