import { createRouter } from "@swan-io/chicane";
import { PropsWithChildren } from "react";
import { match } from "ts-pattern";

import { Client } from "./Pages/Client";
// import { Dashboard } from "./Pages/Dashboard";
import { Login } from "./Pages/Login";
import { Subscription } from "./Pages/Subscription";
import { useAdminSessionStore } from "./stores/useAdminSessionStore";
import { DashboardOverview } from "./Pages/Dashboard/Overview";
import Plan from "./Pages/Plan";
import Feature from "./Pages/Master/Feature";
// import { Dashboard } from "./Pages/Dashboard";
const PrivateRoute = ({ children }: PropsWithChildren) => {
  const token =  useAdminSessionStore((s) => s.token);

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
  Plan: "/plan",
  Feature: "/feature",
} as const;

const paths = Object.keys(routes) as (keyof typeof routes)[];

export const Router = createRouter(routes);

export const Switch = () => {
  const route = Router.useRoute(paths);

  return match(route)
    .with({ name: "Login" }, () => <Login />)
    .with({ name: "Dashboard" }, () => (
      <PrivateRoute>
        <DashboardOverview />
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
    .with({ name: "Plan" }, () => (
      <PrivateRoute>
        <Plan />
      </PrivateRoute>
    ))
    .with({ name: "Feature" }, () => (
      <PrivateRoute>
        <Feature />
      </PrivateRoute>
    ))
    .otherwise(() => "Not found");
};
