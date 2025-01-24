import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // If the request is not FormData, set headers
    if (!(config.data instanceof FormData)) {
      // We no longer need to manually add 'Access-Control-Allow-Origin' in request headers
      config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
    } else {
      config.headers = {
        Accept: "application/json",
      };
    }

    // Return the modified config
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
