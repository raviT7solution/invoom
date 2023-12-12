import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { GraphQLClient } from "graphql-request";

import {
  AdminSessionCreateDocument,
  AdminSessionCreateMutationVariables,
  CurrentAdminDocument,
  FloorObjectUpdateDocument,
  FloorObjectUpdateMutationVariables,
  FloorObjectsDocument,
  FloorObjectsQueryVariables,
  RoleCreateDocument,
  RoleCreateMutationVariables,
  RoleDeleteDocument,
  RoleDeleteMutationVariables,
  RoleDocument,
  RoleUpdateDocument,
  RoleUpdateMutationVariables,
  RolesDocument,
  RolesQueryVariables,
  UserCreateDocument,
  UserCreateMutationVariables,
  UserDeleteDocument,
  UserDeleteMutationVariables,
  UserDocument,
  UserUpdateDocument,
  UserUpdateMutationVariables,
} from "./base";

import { useAdminSessionStore } from "../stores/useAdminSessionStore";

const client = new GraphQLClient(
  `${import.meta.env.VITE_BACKEND_BASE_URL}/graphql`,
  {
    headers: () => ({
      Authorization: useAdminSessionStore.getState().token
        ? `Bearer ${useAdminSessionStore.getState().token}`
        : "",
    }),
    responseMiddleware: (r) => {
      if ("response" in r && r.response.errors) {
        notification.error({
          message: r.response.errors.map((e) => e.message).join(", "),
        });
      }
    },
  },
);

export const useAdminSessionCreate = () => {
  return useMutation({
    mutationFn: (variables: AdminSessionCreateMutationVariables) =>
      client.request(AdminSessionCreateDocument, variables),
  });
};

export const useCurrentAdmin = () => {
  return useQuery({
    queryFn: async () =>
      (await client.request(CurrentAdminDocument)).currentAdmin,
    queryKey: ["currentAdmin"],
  });
};

export const useRoleCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: RoleCreateMutationVariables) =>
      client.request(RoleCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useRoleUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: RoleUpdateMutationVariables) =>
      client.request(RoleUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useRoleDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: RoleDeleteMutationVariables) =>
      client.request(RoleDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useRole = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["role", id],
    queryFn: async () => (await client.request(RoleDocument, { id: id })).role,
  });
};

export const useRoles = (variables: RolesQueryVariables) => {
  return useQuery({
    enabled: variables.restaurantId !== "",
    queryKey: ["roles", variables],
    queryFn: async () => (await client.request(RolesDocument, variables)).roles,
  });
};

export const useUserCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UserCreateMutationVariables) =>
      client.request(UserCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useUserUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UserUpdateMutationVariables) =>
      client.request(UserUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useUserDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UserDeleteMutationVariables) =>
      client.request(UserDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useUser = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["user", id],
    queryFn: async () => (await client.request(UserDocument, { id })).user,
  });
};

export const useFloorObjects = (variables: FloorObjectsQueryVariables) => {
  return useQuery({
    enabled: variables.restaurantId !== "",
    initialData: [],
    queryKey: ["floor_objects", variables],
    queryFn: async () =>
      (await client.request(FloorObjectsDocument, variables)).floorObjects,
  });
};

export const useFloorObjectUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: FloorObjectUpdateMutationVariables) =>
      client.request(FloorObjectUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floor_objects"] });
    },
  });
};
