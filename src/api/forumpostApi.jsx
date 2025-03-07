import apiClient from "./apiClient";

//---------this get all posts from api---//
export const getPosts = (params = {}) =>
  apiClient.get("/posts", { params }).then((res) => res.data);

//---------this get each post info from api---//
export const getSinglePosts = (id) =>
  apiClient.get(`/posts/${id}`).then((res) => res.data);

//---------this upload posts---//
export const uploadPost = (data) =>
  apiClient.post(`/posts`, data).then((res) => res.data);

//---------this display posts---//
export const showUseruploadedPost = (id) =>
  apiClient.get(`/userposts/${id}`).then((res) => res.data);

//---------this display posts---//
export const postsEngagement = (id) =>
  apiClient.get(`/userposts/report/${id}`).then((res) => res.data);

//---------this is total forum engagement---//
export const totalEngagement = (id) =>
  apiClient.get(`/userposts/totalengagement/${id}`).then((res) => res.data);
