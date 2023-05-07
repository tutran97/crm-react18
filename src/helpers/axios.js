import Axios from 'axios';

const axiosInstance = () => {
  const axios = Axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
    responseType: 'json'
  });

  axios.interceptors.request.use((config) => {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers['Authorization'] = `Bearer ${user?.token}`;
    }

    return config;
  });

  return axios;
};

export default axiosInstance;
