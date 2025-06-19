import { useMutation, useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import axios from "axios";
import { Router } from "../Routes";
import { useAdminDataStore } from "../stores/useAdminDataStore";
import { useAdminSessionStore } from "../stores/useAdminSessionStore";

export const logout = () => {
  useAdminSessionStore.getState().destroy();
  useAdminDataStore.getState().destroy();

  Router.push("Login");
};

const apiClient = axios.create({
  baseURL: " https://test-api-invoom.t7solution.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token dynamically, but skip for login
apiClient.interceptors.request.use((config) => {
  const token = useAdminSessionStore.getState().token;

  // Do not set Authorization header for login route
  if (token && config.url !== "/auth/login") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.errors?.map((e: any) => e.message).join(", ") ||
      error.message;

      if (errorMessage === "Session not found") {
        logout();
      }

    notification.error({
      message: errorMessage || "Something went wrong",
    });

    return Promise.reject(error);
  }
);

export const useAdminSessionCreate = () => {
  return useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      apiClient.post("/auth/login", data).then((res) => res.data),
  });
};

export const useClientCreate =async ({}) => {
  return useMutation({
    mutationFn: (data: { attributes: any }) =>
      apiClient.post("/api/v1/clients", data).then((res) => res.data),
  });
};

export const useClients = () => {
  return useQuery({
    // initialData: collectionInitialData,
    queryKey: ["clients", ],
    queryFn: async () =>
    apiClient.post("/api/v1/clients/datatable", ).then((res) => res.data),
  });
};
