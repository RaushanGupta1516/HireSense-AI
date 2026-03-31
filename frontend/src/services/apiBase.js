import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8002/api/v1",
  withCredentials: true,
});

export async function apiCall(method, url, data, config = {}) {
  try {
    const res = await instance[method](url, data, config);
    return res.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default instance;