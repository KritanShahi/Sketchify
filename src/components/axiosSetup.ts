import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Request interceptor: attach access token and refresh if expired
api.interceptors.request.use(async (config: any) => {
  let token = localStorage.getItem("access_token");

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh });
          token = res.data.access;
          localStorage.setItem("access_token", token);
        } catch (err) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/"; // redirect to login
        }
      } else {
        window.location.href = "/";
      }
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
