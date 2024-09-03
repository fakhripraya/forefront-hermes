import axios from "axios";

export const cancelSourceToken = () => {
  return axios.CancelToken.source();
};

export const Axios = (baseUrl) => {
  return axios.create({
    baseURL: baseUrl,
    timeout: 61000,
    withCredentials: true,
  });
};
