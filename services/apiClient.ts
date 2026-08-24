"use client";

import { AxiosInstance, isAxiosError } from "axios";
import {
  createAxiosUnsecuredInstance,
  createAxiosSecuredInstance,
} from "./config";

type SuccessResponse = {
  status: true;
  message: string;
  data: any;
  other?: any;
};

type ErrorResponse = {
  status: false;
  message: string;
  data: any;
  other?: any;
};

const parseMessage = (message: any): string => {
  if (typeof message !== "string") return "";
  return message;
};

const successResponse = (
  message: string = "",
  data: any = null,
  other?: any,
): SuccessResponse => {
  return {
    status: true,
    message: parseMessage(message),
    data,
    other,
  };
};

export const errorResponse = (
  data: any = null,
  message:
    | string
    | undefined = "Some error occurred. Try again or Contact help",
  other?: any,
): ErrorResponse => {
  return {
    status: false,
    message: parseMessage(message),
    data,
    other,
  };
};

const catchError = (error: any): ErrorResponse => {
  if (isAxiosError(error)) {
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      return errorResponse(error?.response?.data, error.response.data?.message);
    } else if (error.request) {
      // No response received from server (network error)
      if (!error.request?.message) {
        return errorResponse(null, "Possible network error 🥲 ");
      }
      return errorResponse(error.request?.data, "Oops ! Network error 🥲 ");
    } else {
      return errorResponse();
    }
  }
  return errorResponse(error);
};

export type ApiClient = {
  get: (
    url: string,
    sensitive?: boolean,
  ) => Promise<SuccessResponse | ErrorResponse>;
  post: (
    url: string,
    data: any,
    sensitive?: boolean,
  ) => Promise<SuccessResponse | ErrorResponse>;
  put: (
    url: string,
    data: any,
    sensitive?: boolean,
  ) => Promise<SuccessResponse | ErrorResponse>;
  delete: (
    url: string,
    sensitive?: boolean,
  ) => Promise<SuccessResponse | ErrorResponse>;
  patch: (
    url: string,
    data: any,
    sensitive?: boolean,
  ) => Promise<SuccessResponse | ErrorResponse>;
};

export function createApiClientSecured(
  token: string | null,
  setAccessToken: SetAccessToken,
  type: ContentType = "json",
): ApiClient {
  const axiosInstance: AxiosInstance = createAxiosSecuredInstance(
    token || "",
    setAccessToken,
    type,
  );

  return {
    get: async (url: string, sensitive: boolean = false) => {
      try {
        const response = await axiosInstance.get(
          sensitive ? `/api/sensitive${url}` : url,
        );
        if (response.data?.success === true) {
          const other = {
            pagination: response?.data?.paginationInfo,
          };
          return successResponse(
            response?.data?.message,
            response?.data?.data,
            other,
          );
        } else {
          return errorResponse(
            response?.data?.message || "Some error occured",
            response?.data,
          );
        }
      } catch (error) {
        return catchError(error);
      }
    },

    post: async (url: string, data: any, sensitive: boolean = false) => {
      try {
        const response = await axiosInstance.post(
          sensitive ? `/api/sensitive${url}` : url,
          data,
        );
        if (response.data?.success === true) {
          return successResponse(
            response?.data?.message,
            response?.data?.data,
            response?.data?.other,
          );
        }
        return errorResponse(
          response?.data?.message || "Some error occured",
          response?.data,
        );
      } catch (error) {
        return catchError(error);
      }
    },

    put: async (url: string, data: any, sensitive: boolean = false) => {
      try {
        const response = await axiosInstance.put(
          sensitive ? `/api/sensitive${url}` : url,
          data,
        );

          if (response.data?.success === true) {
          return successResponse(
            response?.data?.message,
            response?.data?.data,
            response?.data?.other,
          );
        }
        return errorResponse(
          response?.data?.message || "Some error occured",
          response?.data,
        );
      } catch (error) {
        return catchError(error);
      }
    },

    delete: async (url: string, sensitive: boolean = false) => {
      try {
        const response = await axiosInstance.delete(
          sensitive ? `/api/sensitive${url}` : url,
        );
        if (response.data?.success === true) {
          const other = {
            pagination: response?.data?.paginationInfo,
          };
          return successResponse(
            response?.data?.message,
            response?.data?.data,
            other,
          );
        } else {
          return errorResponse(
            response?.data?.message || "Some error occured",
            response?.data,
          );
        }
      } catch (error) {
        return catchError(error);
      }
    },

    patch: async (url: string, data: any, sensitive: boolean = false) => {
      try {
        const response = await axiosInstance.patch(
          sensitive ? `/api/sensitive${url}` : url,
          data,
        );
        if (response.data?.success === true) {
          const other = {
            pagination: response?.data?.paginationInfo,
          };
          return successResponse(
            response?.data?.message,
            response?.data?.data,
            other,
          );
        } else {
          return errorResponse(
            response?.data?.message || "Some error occured",
            response?.data,
          );
        }
      } catch (error) {
        return catchError(error);
      }
    },
  };
}

export function createApiClient(type: ContentType = "json"): ApiClient {
  const axiosInstance: AxiosInstance = createAxiosUnsecuredInstance(type);

  return {
    get: async (url: string, sensitive: boolean = false) => {
      try {
        const response = await axiosInstance.get(
          sensitive ? `/api/sensitive${url}` : url,
        );
        if (response.data?.success === true) {
          const other = {
            pagination: response?.data?.paginationInfo,
          };
          return successResponse(
            response?.data?.message,
            response?.data?.data,
            other,
          );
        } else {
          return errorResponse(
            response?.data?.message || "Some error occured",
            response?.data,
          );
        }
      } catch (error) {
        return catchError(error);
      }
    },

    post: async (url: string, data: any, sensitive: boolean = false) => {
      try {
        const response = await axiosInstance.post(
          sensitive ? `/api/sensitive${url}` : url,
          data,
        );
        //console.log("apiClient response", response);
        if (response.data?.success === true) {
          return successResponse(
            response?.data?.message,
            response?.data?.data,
            response?.data?.other,
          );
        }
        return errorResponse(
          response?.data?.message || "Some error occured",
          response?.data,
        );
      } catch (error) {
        //console.log("apiClient error", error);
        return catchError(error);
      }
    },

    put: async (url: string, data: any, sensitive: boolean = false) => {
      try {
        const response = await axiosInstance.put(
          sensitive ? `/api/sensitive${url}` : url,
          data,
        );

        if (response.data?.success === true) {
          return successResponse(
            response?.data?.message,
            response?.data?.data,
            response?.data?.other,
          );
        }
        return errorResponse(
          response?.data?.message || "Some error occured",
          response?.data,
        );
      } catch (error) {
        return catchError(error);
      }
    },

    delete: async (url: string, sensitive: boolean = false) => {
      try {
        const response = await axiosInstance.delete(
          sensitive ? `/api/sensitive${url}` : url,
        );
        return successResponse(
          response.data.message,
          response.data.data,
          response.data.other,
        );
      } catch (error) {
        return catchError(error);
      }
    },

    patch: async (url: string, data: any, sensitive: boolean = false) => {
      try {
        const response = await axiosInstance.patch(
          sensitive ? `/api/sensitive${url}` : url,
          data,
        );
        return successResponse(
          response.data.message,
          response.data.data,
          response.data.other,
        );
      } catch (error) {
        return catchError(error);
      }
    },
  };
}
