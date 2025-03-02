import apiClient from "./apiClient";

//---------this get all posts from api---//
export const postVote = (data) =>
  apiClient.post("/votes", data).then((res) => res.data);
