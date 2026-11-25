
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3000",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("terangamarket_token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   // Laisser le navigateur gérer le Content-Type des fichiers FormData
//   if (config.data instanceof FormData) {
//     config.headers.delete("Content-Type");
//   } else {
//     config.headers.set("Content-Type", "application/json");
//   }

//   return config;
// });

// export default api;





import axios from "axios";

export const API_BASE_URL =
  "https://teranga-market-backend-64wi.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("terangamarket_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
