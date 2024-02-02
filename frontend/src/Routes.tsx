import { createRouter } from "@swan-io/chicane";
import { PropsWithChildren } from "react";
import { match } from "ts-pattern";

import { Addons } from "./Pages/CuisineHub/Addons";
import { Categories } from "./Pages/CuisineHub/Categories";
import { Item } from "./Pages/CuisineHub/Item";
import { Menus } from "./Pages/CuisineHub/Menu";
import { FloorPlan } from "./Pages/FloorPlan";
import { Login } from "./Pages/Login";
import { Roles } from "./Pages/Teams/Roles";
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
  CuisineHubAddons: "/cuisine-hub/addons",
  CuisineHubCategories: "/cuisine-hub/categories",
  CuisineHubItems: "/cuisine-hub/items",
  CuisineHubMenus: "/cuisine-hub/menus",
  Dashboard: "/",
  FloorPlan: "/floor-plan",
  Login: "/login",
  Teams: "/teams",
} as const;

const paths = Object.keys(routes) as (keyof typeof routes)[];

export const Router = createRouter(routes);

export const Switch = () => {
  const route = Router.useRoute(paths);

  return match(route)
    .with({ name: "Login" }, () => <Login />)
    .with({ name: "Dashboard" }, () => (
      <PrivateRoute>
        <Roles />
      </PrivateRoute>
    ))
    .with({ name: "Teams" }, () => (
      <PrivateRoute>
        <Roles />
      </PrivateRoute>
    ))
    .with({ name: "FloorPlan" }, () => (
      <PrivateRoute>
        <FloorPlan />
      </PrivateRoute>
    ))
    .with({ name: "CuisineHubMenus" }, () => (
      <PrivateRoute>
        <Menus />
      </PrivateRoute>
    ))
    .with({ name: "CuisineHubCategories" }, () => (
      <PrivateRoute>
        <Categories />
      </PrivateRoute>
    ))
    .with({ name: "CuisineHubItems" }, () => (
      <PrivateRoute>
        <Item />
      </PrivateRoute>
    ))
    .with({ name: "CuisineHubAddons" }, () => (
      <PrivateRoute>
        <Addons />
      </PrivateRoute>
    ))
    .otherwise(() => "Not found");
};
