import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  baseURL: "https://test-api-invoom.t7solution.com",
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

const collectionInitialData = {
  data: [],
  dataTableMetaDTO: {
    page: 1,
    perpage: 0,
    total: 0,
    pages: 0,
  },
};


export const useAdminSessionCreate = () => {
  return useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      apiClient.post("/auth/login", data).then((res) => res.data),
  });
};

export const useClientCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.post("/api/v1/clients", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useClientUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.put(`/api/v1/clients`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useClientStatusUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.put(`/api/v1/clients/status`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useClient = (id: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["client", id],
    queryFn: async () =>
      apiClient.get(`/api/v1/clients/${id}`).then((res) => res.data.response), // 👈 extract response
  });
};


export const useClients = ({ start, length }: { start: number; length: number }) => {
  return useQuery({
    queryKey: ["clients", start, length],
    queryFn: async () =>
      apiClient
        .post("/api/v1/clients/datatable", { start, length })
        .then((res) => res.data),
    initialData: collectionInitialData,
  });
};


export const useClientDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/api/v1/clients/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useRoles = ({ start, length }: { start: number; length: number }) => {
  return useQuery({
    queryKey: ["clients", start, length],
    queryFn: async () =>
      apiClient
        .post("/api/v1/clients/datatable", { start, length })
        .then((res) => res.data),
    initialData: collectionInitialData,
  });
};

export const useUserRoles = ({ start, length }: { start: number; length: number }) => {
  return useQuery({
    queryKey: ["user-roles", start, length],
    queryFn: async () =>
      apiClient
        .post("/api/user-role/datatable", { start, length })
        .then((res) => res.data),
    initialData: collectionInitialData,
  });
};

export const useListUserRoles = (id: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["list-user-role", id],
    queryFn: async () =>
      apiClient.get(`/api/user-role/${id}`).then((res) => res.data.response),
  });
};


export const useUserRoleCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.post("/api/user-role", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
    },
  });
};

export const useUserRole = (id: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["user-role", id],
    queryFn: async () =>
      apiClient.get(`/api/user-role/${id}`).then((res) => res.data.response), // 👈 extract response
  });
};

export const useUserRoleUpdate = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.put(`/api/user-role/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
    },
  });
};

export const useUserRoleDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/api/user-role/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
    },
  });
};
