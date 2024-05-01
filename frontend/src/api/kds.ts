import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { GraphQLClient } from "graphql-request";

import {
  AdminSessionCreateDocument,
  AdminSessionCreateMutationVariables,
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

export const useKDSSessionCreate = () => {
  return useMutation({
    mutationFn: async (variables: AdminSessionCreateMutationVariables) =>
      (await client.request(AdminSessionCreateDocument, variables))
        .adminSessionCreate,
  });
};
