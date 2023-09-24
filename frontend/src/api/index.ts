import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";

import { TestQuery, TestQueryVariables } from "./base";

const client = new GraphQLClient(
  `${import.meta.env.VITE_BACKEND_BASE_URL}/graphql`,
);

const test = gql`
  query test {
    testField
  }
`;

export const useTest = () => {
  return useQuery({
    queryKey: ["test"],
    queryFn: () => client.request<TestQuery, TestQueryVariables>(test),
  });
};
