import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { GraphQLClient } from "graphql-request";

import {
  AdminSessionCreateDocument,
  AdminSessionCreateMutationVariables,
} from "./base";

import { useAdminSessionStore } from "../stores/useAdminSessionStore";

const client = new GraphQLClient(
  `${import.meta.env.VITE_BACKEND_BASE_URL}/graphql`,
  {
    headers: () => ({
      Authorization: `Bearer ${useAdminSessionStore.getState().token}`,
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
