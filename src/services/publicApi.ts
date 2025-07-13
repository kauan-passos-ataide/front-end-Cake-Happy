import axios from 'axios';

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API,
  withCredentials: true,
});

export default publicApi;
