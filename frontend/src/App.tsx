import { StyleProvider } from "@ant-design/cssinjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Switch } from "./Routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => {
  return (
    <StyleProvider hashPriority="high">
      <QueryClientProvider client={queryClient}>
        <Switch />
      </QueryClientProvider>
    </StyleProvider>
  );
};

export default App;
