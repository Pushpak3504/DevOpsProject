import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.80.20:5000",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
