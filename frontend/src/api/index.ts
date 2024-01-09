import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { GraphQLClient } from "graphql-request";

import {
  AddonDocument,
  AddonsCreateDocument,
  AddonsCreateMutationVariables,
  AddonsDeleteDocument,
  AddonsDeleteMutationVariables,
  AddonsDocument,
  AddonsUpdateDocument,
  AddonsUpdateMutationVariables,
  AdminSessionCreateDocument,
  AdminSessionCreateMutationVariables,
  CategoriesDocument,
  CategoryDeleteDocument,
  CategoryDeleteMutationVariables,
  CategoryDocument,
  CategoryUpdateDocument,
  CategoryUpdateMutationVariables,
  CreateCategoryDocument,
  CreateCategoryMutationVariables,
  CurrentAdminDocument,
  FloorObjectUpdateDocument,
  FloorObjectUpdateMutationVariables,
  FloorObjectsDocument,
  FloorObjectsQueryVariables,
  MenuCreateDocument,
  MenuCreateMutationVariables,
  MenuDeleteDocument,
  MenuDeleteMutationVariables,
  MenuDocument,
  MenuUpdateDocument,
  MenuUpdateMutationVariables,
  MenusDocument,
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

export const useMenus = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryFn: async () =>
      (await client.request(MenusDocument, { restaurantId })).menus,
    queryKey: ["menus", restaurantId],
  });
};

export const useMenu = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryFn: async () => (await client.request(MenuDocument, { id })).menu,
    queryKey: ["menu", id],
  });
};

export const useMenuCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: MenuCreateMutationVariables) =>
      client.request(MenuCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
};

export const useMenuDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: MenuDeleteMutationVariables) =>
      client.request(MenuDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
};

export const useMenuUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: MenuUpdateMutationVariables) =>
      client.request(MenuUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
};
export const useCategoryCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateCategoryMutationVariables) =>
      client.request(CreateCategoryDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useCategories = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryFn: async () =>
      (await client.request(CategoriesDocument, { restaurantId })).categories,
    queryKey: ["categories", restaurantId],
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["category", id],
    queryFn: async () =>
      (await client.request(CategoryDocument, { id: id })).category,
  });
};

export const useCategoryUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CategoryUpdateMutationVariables) =>
      client.request(CategoryUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useCategoryDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CategoryDeleteMutationVariables) =>
      client.request(CategoryDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useAddons = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryKey: ["addons", restaurantId],
    queryFn: async () =>
      (await client.request(AddonsDocument, { restaurantId })).addons,
  });
};

export const useAddon = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["addon", id],
    queryFn: async () =>
      (await client.request(AddonDocument, { id: id })).addon,
  });
};

export const useAddonsCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: AddonsCreateMutationVariables) =>
      client.request(AddonsCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
};

export const useAddonsUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: AddonsUpdateMutationVariables) =>
      client.request(AddonsUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
};

export const useAddonsDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: AddonsDeleteMutationVariables) =>
      client.request(AddonsDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
};
