import { createRouter } from "@swan-io/chicane";
import { PropsWithChildren } from "react";
import { match } from "ts-pattern";

import { Client } from "./Pages/Client";
import { Dashboard } from "./Pages/Dashboard";
import { Login } from "./Pages/Login";
import { Subscription } from "./Pages/Subscription";

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const token = "test"; //useAdminSessionStore((s) => s.token);

  if (!token) {
    Router.replace("Login");

    return;
  }

  return children;
};


const routes = {
  Dashboard: "/",
  Login: "/login",
  Client: "/client",
  Subscription: "/subscription",
} as const;

const paths = Object.keys(routes) as (keyof typeof routes)[];

export const Router = createRouter(routes);

export const Switch = () => {
  const route = Router.useRoute(paths);

  return match(route)
    .with({ name: "Login" }, () => <Login />)
    .with({ name: "Dashboard" }, () => (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ))
    .with({ name: "Client" }, () => (
      <PrivateRoute>
        <Client />
      </PrivateRoute>
    ))
    .with({ name: "Subscription" }, () => (
      <PrivateRoute>
        <Subscription />
      </PrivateRoute>
    ))
    .otherwise(() => "Not found");
};
