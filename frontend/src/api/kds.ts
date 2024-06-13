import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { GraphQLClient } from "graphql-request";

import {
  AdminSessionCreateDocument,
  AdminSessionCreateMutationVariables,
  CurrentAdminDocument,
  KitchenProfilesDocument,
  RestaurantsDocument,
  TicketItemsUpdateDocument,
  TicketItemsUpdateMutationVariables,
  TicketsDocument,
  TicketsQueryVariables,
} from "./base";

import { useKDSSessionStore } from "../stores/useKDSSessionStore";

const client = new GraphQLClient(
  `${import.meta.env.VITE_BACKEND_BASE_URL}/graphql`,
  {
    headers: () => ({
      Authorization: useKDSSessionStore.getState().token
        ? `Bearer ${useKDSSessionStore.getState().token}`
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

const collectionInitialData = {
  collection: [],
  metadata: {
    currentPage: 1,
    limitValue: 0,
    totalCount: 0,
    totalPages: 0,
  },
};

export const useKDSSessionCreate = () => {
  return useMutation({
    mutationFn: async (variables: AdminSessionCreateMutationVariables) =>
      (await client.request(AdminSessionCreateDocument, variables))
        .adminSessionCreate,
  });
};

export const useCurrentAdmin = () => {
  return useQuery({
    queryFn: async () =>
      (await client.request(CurrentAdminDocument)).currentAdmin,
    queryKey: ["currentAdmin"],
  });
};

export const useRestaurants = () => {
  const token = useKDSSessionStore((s) => s.token);

  return useQuery({
    enabled: !!token,
    initialData: [],
    queryKey: ["restaurants"],
    queryFn: async () =>
      (await client.request(RestaurantsDocument, {})).restaurants,
  });
};

export const useTickets = (variables: TicketsQueryVariables) => {
  return useQuery({
    enabled: !!variables.restaurantId,
    initialData: collectionInitialData,
    queryKey: ["tickets", variables],
    queryFn: async () =>
      (await client.request(TicketsDocument, variables)).tickets,
  });
};

export const useTicketItemsUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TicketItemsUpdateMutationVariables) =>
      client.request(TicketItemsUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useKitchenProfiles = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryKey: ["kitchenProfiles", restaurantId],
    queryFn: async () =>
      (
        await client.request(KitchenProfilesDocument, {
          restaurantId: restaurantId,
        })
      ).kitchenProfiles,
  });
};
