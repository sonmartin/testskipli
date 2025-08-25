import axios from "axios";

const AppAPIInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API,
});

export default AppAPIInstance;
