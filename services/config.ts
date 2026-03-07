"use client";

import { dynamicPaths } from "@/lib/constants/paths";
import { API_BASE_PATH, baseUrl } from "@/lib/constants";

import axios, { AxiosInstance } from "axios";
import { useRouter } from "next/navigation";
const SENSITIVE_BASE_PATH = "/api/sensitive";

const interceptAxiosResponse = (
  instance: AxiosInstance,
  setAccessToken: SetAccessToken,
  goToLogin: () => void,
) =>
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const initialRequest = error?.config;
      if (error?.response?.status === 401 && !initialRequest?._retry) {
        initialRequest._retry = true;
        try {
          const newTokenResponse = await fetch("/api/auth/refresh", {
            method: "GET",
            credentials: "include",
          });

          const newTokenRes = await newTokenResponse.json();
          const newAccessToken = newTokenRes?.accessToken;

          if (newAccessToken) {
            setAccessToken(newAccessToken);
            initialRequest.headers["Authorization"] =
              `Bearer ${newAccessToken}`;
            return instance(initialRequest);
          }
        } catch (refreshError) {
          // TODO: handle refresh error
          goToLogin();
        }
      }
      return Promise.reject(error);
    },
  );

export const createAxiosSecuredInstance = (
  token: string,
  setAccessToken: SetAccessToken,
  type: ContentType,
): AxiosInstance => {
  const router = useRouter();
  const goToLogin = () => {
    router.push(dynamicPaths(null).auth.login());
  };
  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": `${
        type === "json" ? "application/json" : "multipart/form-data"
      }`,
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  instance.interceptors.request.use((config) => {
    if (config.url?.startsWith(SENSITIVE_BASE_PATH)) {
      config.baseURL = "";
    } else {
      config.baseURL = baseUrl + API_BASE_PATH;
    }
    return config;
  });

 // interceptAxiosResponse(instance, setAccessToken, goToLogin);

  return instance;
};

export const createAxiosUnsecuredInstance = (
  type: ContentType,
): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseUrl + API_BASE_PATH,
    headers: {
      "Content-Type": `${
        type === "json" ? "application/json" : "multipart/form-data"
      }`,
      Accept: "application/json",
    },
  });

  // instance.interceptors.request.use((config) => {
  //   if (config.url?.startsWith(SENSITIVE_BASE_PATH)) {
  //     config.baseURL = "";
  //   } else {
  //     config.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL + API_BASE_PATH;
  //   }
  //   return config;
  // });

  return instance;
};
