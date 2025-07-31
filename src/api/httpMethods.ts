import axiosInstance from './axiosInstance';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export const getMethod = async <T>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  const response: AxiosResponse<T> = await axiosInstance.get(endpoint, config);
  return response.data;
};

export const postMethod = async <T>(
  endpoint: string,
  data: any,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  const response: AxiosResponse<T> = await axiosInstance.post(
    endpoint,
    data,
    config
  );
  return response.data;
};

export const putMethod = async <T>(
  endpoint: string,
  data: any,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  const response: AxiosResponse<T> = await axiosInstance.put(
    endpoint,
    data,
    config
  );
  return response.data;
};

export const deleteMethod = async <T>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  const response: AxiosResponse<T> = await axiosInstance.delete(
    endpoint,
    config
  );
  return response.data;
};
