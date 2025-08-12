import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import { store } from "../redux/index";
import { setLogout } from "../redux/slice/userSlice";

// Create Axios instance
const instance = axios.create({
  baseURL: "https://client1.appsstaging.com:3017/api/v1/",
  timeout: 20000,
});

// Request interceptor
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = store.getState().user.token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const message = error.response?.data?.message || error.message;

    console.error("API Error:", message);
    if (typeof message === "string" && message.includes("Unauthorized")) {
      store.dispatch(setLogout());
    }

    return Promise.reject(message || "Something went wrong. Please try again.");
  }
);

type ApiHelperResponse<T = any> = {
  error: string | null;
  response: AxiosResponse<T> | null;
};

export const apiHelper = async <T = any>(
  method: Method,
  endPoint: string,
  customHeaders: Record<string, string> = {},
  body: any = null,
  customConfig: AxiosRequestConfig = {}
): Promise<ApiHelperResponse<T>> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url: endPoint,
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
      ...(method !== "GET" && body != null ? { data: body } : {}),
      ...customConfig,
    };

    const response = await instance.request<T>(config);
    return {
      error: null,
      response,
    };
  } catch (error: any) {
    return {
      error:
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong.",
      response: null,
    };
  }
};
