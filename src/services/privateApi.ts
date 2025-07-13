import axios, { AxiosError } from 'axios';
import { logout } from '@/lib/utils';
import * as dotenv from 'dotenv';

dotenv.config();

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: AxiosError | unknown) => void;
};
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (
  error: AxiosError | unknown,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

const privateApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API as string,
  withCredentials: true,
});

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              resolve(privateApi(originalRequest));
            },
            reject: reject,
          });
        });
      }

      isRefreshing = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_URL_API}/user/refresh`,
          {},
          { withCredentials: true },
        );

        return privateApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default privateApi;
