import axios from "axios";

/* ----------------- Base Axios Instance ----------------- */

const api = axios.create({
  baseURL: import.meta.env.PROD ? "/api" : "http://3.108.63.227:5000/api/v1",
  withCredentials: true   // ❗ Only refresh uses cookies
});

/* ----------------- Attach Access Token ----------------- */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ----------------- Refresh Token Function ----------------- */

const refreshAccessToken = async () => {
  const baseURL = import.meta.env.PROD ? "/api" : "http://3.108.63.227:5000/api/v1";
  const response = await axios.post(
    `${baseURL}/users/refresh-accessToken`,
    {},
    { withCredentials: true }   // ✅ cookies only here
  );

  const newToken = response.data.data.accessToken;
  localStorage.setItem("token", newToken);

  return newToken;
};

/* ----------------- Response Interceptor ----------------- */

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
