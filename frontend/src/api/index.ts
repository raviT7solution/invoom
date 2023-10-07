import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { GraphQLClient } from "graphql-request";

import {
  UserSessionCreateDocument,
  UserSessionCreateMutationVariables,
} from "./base";

import { useUserSessionsStore } from "../stores/useUserSessionStore";

const client = new GraphQLClient(
  `${import.meta.env.VITE_BACKEND_BASE_URL}/graphql`,
  {
    headers: () => ({
      Authorization: `Bearer ${useUserSessionsStore.getState().token}`,
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

export const useUserSessionCreate = () => {
  return useMutation({
    mutationFn: (variables: UserSessionCreateMutationVariables) =>
      client.request(UserSessionCreateDocument, variables),
  });
};
