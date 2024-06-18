import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import { message as AntdMessage } from "antd";
import Router from "next/router";

interface AxiosInstanceType extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
}

const CreateAxiosInstance = (
  config?: AxiosRequestConfig
): AxiosInstanceType => {
  // 接受其他配置选项
  const instance = axios.create({
    // 创建一个新的 Axios 实例，类型为AxiosInstance
    timeout: 5000, // 设置默认请求超时时间为5000毫秒
    ...config,
  });

  // 定义请求中间件/拦截器
  instance.interceptors.request.use(
    function (config) {
      const userStorage = localStorage.getItem("user");
      const token = userStorage ? JSON.parse(userStorage).token : "";
      config.headers["Authorization"] = "Bearer " + token; // 添加Authorization请求头
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // 定义响应中间件/拦截器
  instance.interceptors.response.use(
    function (response) {
      // 2xx 范围内的任何状态代码都会触发此功能
      // 处理响应数据
      const { status, data } = response;
      if (status === 200) {
        return data;
      }
    },
    function (error) {
      // 任何超出 2xx 范围的状态代码都会触发此功能
      // 处理响应错误
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          return Router.push("/login");
        } else if (status === 403) {
          // 禁止访问，显示错误信息
          AntdMessage.error(
            "You do not have permission to perform this action."
          );
        } else if (status === 404) {
          // 资源未找到
          AntdMessage.error("The requested resource was not found.");
        } else {
          // 处理其他类型的错误
          AntdMessage.error(data.message || "Internal Server Error");
        }
      } else {
        // 处理没有响应的情况（例如，网络错误）
        AntdMessage.error("Network Error");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default CreateAxiosInstance({}); // 导出使用默认配置的 Axios 实例
