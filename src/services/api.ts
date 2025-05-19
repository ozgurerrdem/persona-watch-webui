import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const username = localStorage.getItem("username");
  if (username) {
    config.headers["x-username"] = username;
  }

  return config;
});

export default api;
