import { createRouter } from "@swan-io/chicane";
import { PropsWithChildren } from "react";
import { match } from "ts-pattern";

import { Login } from "./Pages/Login";
import { SettingsUsers } from "./Pages/Settings/Users";
import { useAdminSessionStore } from "./stores/useAdminSessionStore";

export const PrivateRoute = ({ children }: PropsWithChildren) => {
  const token = useAdminSessionStore((s) => s.token);

  if (!token) {
    Router.replace("Login");

    return;
  }

  return children;
};

const routes = {
  Dashboard: "/",
  Login: "/login",
  SettingsUsers: "/settings/users",
} as const;

const paths = Object.keys(routes) as (keyof typeof routes)[];

export const Router = createRouter(routes);

export const Switch = () => {
  const route = Router.useRoute(paths);

  return match(route)
    .with({ name: "Login" }, () => <Login />)
    .with({ name: "Dashboard" }, () => (
      <PrivateRoute>
        <SettingsUsers />
      </PrivateRoute>
    ))
    .with({ name: "SettingsUsers" }, () => (
      <PrivateRoute>
        <SettingsUsers />
      </PrivateRoute>
    ))
    .otherwise(() => "Not found");
};
