import { createRouter } from "@swan-io/chicane";
import { PropsWithChildren } from "react";
import { match } from "ts-pattern";

import { Addons } from "./Pages/CuisineHub/Addons";
import { Categories } from "./Pages/CuisineHub/Categories";
import { Item } from "./Pages/CuisineHub/Item";
import { Menus } from "./Pages/CuisineHub/Menu";
import { Modifiers } from "./Pages/CuisineHub/Modifiers";
import { FloorPlan } from "./Pages/FloorPlan";
import { InventoryCategories } from "./Pages/Inventory/Categories";
import { InventoryProducts } from "./Pages/Inventory/Products";
import { KDSHome } from "./Pages/KDS/Home";
import { KDSLogin } from "./Pages/KDS/Login";
import { Login } from "./Pages/Login";
import { Discounts } from "./Pages/Promotions/Discounts";
import { ReportsLabour } from "./Pages/Reports/Labour";
import { ChangePassword } from "./Pages/Settings/ChangePassword";
import { KitchenProfiles } from "./Pages/Settings/KitchenProfiles";
import { OperationPin } from "./Pages/Settings/OperationPin";
import { Restaurants } from "./Pages/Settings/Restaurants";
import { Taxes } from "./Pages/Settings/Taxes";
import { Roles } from "./Pages/Teams/Roles";
import { useAdminSessionStore } from "./stores/useAdminSessionStore";
import { useKDSSessionStore } from "./stores/useKDSSessionStore";

export const PrivateRoute = ({ children }: PropsWithChildren) => {
  const token = useAdminSessionStore((s) => s.token);

  if (!token) {
    Router.replace("Login");

    return;
  }

  return children;
};

export const KDSPrivateRoute = ({ children }: PropsWithChildren) => {
  const token = useKDSSessionStore((s) => s.token);

  if (!token) {
    Router.replace("KDSLogin");

    return;
  }

  return children;
};

const routes = {
  ChangePassword: "/settings/change-password",
  CuisineHubAddons: "/cuisine-hub/addons",
  CuisineHubCategories: "/cuisine-hub/categories",
  CuisineHubItems: "/cuisine-hub/items",
  CuisineHubMenus: "/cuisine-hub/menus",
  CuisineHubModifiers: "/cuisine-hub/modifiers",
  Dashboard: "/",
  FloorPlan: "/floor-plan",
  InventoryCategories: "/inventory/categories",
  InventoryProducts: "/inventory/products",
  KDS: "/kds",
  KDSLogin: "/kds/login",
  Login: "/login",
  PromotionsDiscounts: "/promotions/discounts",
  ReportsLabour: "/reports/labour",
  SettingsKitchenProfiles: "/settings/kitchen-profiles",
  SettingsOperationPin: "/settings/operation-pin",
  SettingsRestaurants: "/settings/restaurants",
  SettingsTaxes: "/settings/taxes",
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
    .with({ name: "SettingsRestaurants" }, () => (
      <PrivateRoute>
        <Restaurants />
      </PrivateRoute>
    ))
    .with({ name: "CuisineHubModifiers" }, () => (
      <PrivateRoute>
        <Modifiers />
      </PrivateRoute>
    ))
    .with({ name: "PromotionsDiscounts" }, () => (
      <PrivateRoute>
        <Discounts />
      </PrivateRoute>
    ))
    .with({ name: "InventoryCategories" }, () => (
      <PrivateRoute>
        <InventoryCategories />
      </PrivateRoute>
    ))
    .with({ name: "SettingsOperationPin" }, () => (
      <PrivateRoute>
        <OperationPin />
      </PrivateRoute>
    ))
    .with({ name: "InventoryProducts" }, () => (
      <PrivateRoute>
        <InventoryProducts />
      </PrivateRoute>
    ))
    .with({ name: "ReportsLabour" }, () => (
      <PrivateRoute>
        <ReportsLabour />
      </PrivateRoute>
    ))
    .with({ name: "SettingsTaxes" }, () => (
      <PrivateRoute>
        <Taxes />
      </PrivateRoute>
    ))
    .with({ name: "KDSLogin" }, () => <KDSLogin />)
    .with({ name: "KDS" }, () => (
      <KDSPrivateRoute>
        <KDSHome />
      </KDSPrivateRoute>
    ))
    .with({ name: "ChangePassword" }, () => (
      <PrivateRoute>
        <ChangePassword />
      </PrivateRoute>
    ))
    .with({ name: "SettingsKitchenProfiles" }, () => (
      <PrivateRoute>
        <KitchenProfiles />
      </PrivateRoute>
    ))
    .otherwise(() => "Not found");
};
