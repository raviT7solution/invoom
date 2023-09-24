import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useTest } from "./api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Test = () => {
  const { data } = useTest();

  return <h1>{data?.testField}</h1>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Test />
    </QueryClientProvider>
  );
};

export default App;
