import { apiClient } from "./apiClient";

//---------this get all authors from api---//
export const getLibrarian = () =>
  apiClient.get("/admindashboard").then((res) => res.data);
