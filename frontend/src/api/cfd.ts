import { useMutation, useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { GraphQLClient } from "graphql-request";

import {
  AdminSessionCreateDocument,
  AdminSessionCreateMutationVariables,
  DevicesDocument,
  InvoiceDocument,
  RestaurantsDocument,
} from "./base";

import { Router } from "../Routes";
import { useCFDConfigStore } from "../stores/useCFDConfigStore";
import { useCFDSessionStore } from "../stores/useCFDSessionStore";

export const logout = () => {
  useCFDSessionStore.getState().destroy();
  useCFDConfigStore.getState().reset();

  Router.push("CFDLogin");
};

const client = new GraphQLClient(
  `${import.meta.env.VITE_BACKEND_BASE_URL}/graphql`,
  {
    headers: () => ({
      Authorization: useCFDSessionStore.getState().token
        ? `Bearer ${useCFDSessionStore.getState().token}`
        : "",
    }),
    responseMiddleware: (r) => {
      if (
        "response" in r &&
        r.response.errors?.map((i) => i.message).join("") ===
          "Session not found"
      ) {
        logout();

        return;
      }

      if ("response" in r && r.response.errors) {
        notification.error({
          message: r.response.errors.map((e) => e.message).join(", "),
        });
      }
    },
  },
);

export const useCFDSessionCreate = () => {
  return useMutation({
    mutationFn: async (variables: AdminSessionCreateMutationVariables) =>
      (await client.request(AdminSessionCreateDocument, variables))
        .adminSessionCreate,
  });
};

export const useRestaurants = () => {
  return useQuery({
    initialData: [],
    queryFn: async () =>
      (await client.request(RestaurantsDocument, {})).restaurants,
    queryKey: ["restaurants"],
  });
};

export const useDevices = (restaurantId: string) => {
  return useQuery({
    initialData: [],
    queryFn: async () =>
      (await client.request(DevicesDocument, { restaurantId })).devices,
    queryKey: ["devices", restaurantId],
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryFn: async () =>
      (await client.request(InvoiceDocument, { id })).invoice,
    queryKey: ["invoice", id],
  });
};
