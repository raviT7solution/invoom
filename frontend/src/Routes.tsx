import { createRouter } from "@swan-io/chicane";
import { PropsWithChildren } from "react";
import { match } from "ts-pattern";

import { CFDHome } from "./Pages/CFD/Home";
import { CFDLogin } from "./Pages/CFD/Login";
import { Addons } from "./Pages/CuisineHub/Addons";
import { Categories } from "./Pages/CuisineHub/Categories";
import { Item } from "./Pages/CuisineHub/Item";
import { Menus } from "./Pages/CuisineHub/Menu";
import { Modifiers } from "./Pages/CuisineHub/Modifiers";
import { Dashboard } from "./Pages/Dashboard";
import { FloorPlan } from "./Pages/FloorPlan";
import { InventoryCategories } from "./Pages/Inventory/Categories";
import { InventoryProducts } from "./Pages/Inventory/Products";
import { KDSHome } from "./Pages/KDS/Home";
import { KDSLogin } from "./Pages/KDS/Login";
import { Login } from "./Pages/Login";
import { Discounts } from "./Pages/Promotions/Discounts";
import { ReportsCustomers } from "./Pages/Reports/Customers";
import { ReportsLabour } from "./Pages/Reports/Labour";
import { ReportsSales } from "./Pages/Reports/Sales";
import { ChangePassword } from "./Pages/Settings/ChangePassword";
import { Devices } from "./Pages/Settings/Devices";
import { KitchenProfiles } from "./Pages/Settings/KitchenProfiles";
import { Restaurants } from "./Pages/Settings/Restaurants";
import { RestaurantSettings } from "./Pages/Settings/RestaurantSettings";
import { Roles } from "./Pages/Teams/Roles";
import { useAdminSessionStore } from "./stores/useAdminSessionStore";
import { useCFDSessionStore } from "./stores/useCFDSessionStore";
import { useKDSSessionStore } from "./stores/useKDSSessionStore";

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const token = useAdminSessionStore((s) => s.token);

  if (!token) {
    Router.replace("Login");

    return;
  }

  return children;
};

const KDSPrivateRoute = ({ children }: PropsWithChildren) => {
  const token = useKDSSessionStore((s) => s.token);

  if (!token) {
    Router.replace("KDSLogin");

    return;
  }

  return children;
};

const CFDPrivateRoute = ({ children }: PropsWithChildren) => {
  const token = useCFDSessionStore((s) => s.token);

  if (!token) {
    Router.replace("CFDLogin");

    return;
  }

  return children;
};

const routes = {
  CFD: "/cfd",
  CFDLogin: "/cfd/login",
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
  ReportsCustomers: "/reports/customers",
  ReportsLabour: "/reports/labour",
  ReportsSales: "/reports/sales",
  RestaurantSettings: "/settings/restaurant-settings",
  SettingsDevices: "/settings/devices",
  SettingsKitchenProfiles: "/settings/kitchen-profiles",
  SettingsRestaurants: "/settings/restaurants",
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
        <Dashboard />
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
    .with({ name: "RestaurantSettings" }, () => (
      <PrivateRoute>
        <RestaurantSettings />
      </PrivateRoute>
    ))
    .with({ name: "InventoryProducts" }, () => (
      <PrivateRoute>
        <InventoryProducts />
      </PrivateRoute>
    ))
    .with({ name: "ReportsCustomers" }, () => (
      <PrivateRoute>
        <ReportsCustomers />
      </PrivateRoute>
    ))
    .with({ name: "ReportsLabour" }, () => (
      <PrivateRoute>
        <ReportsLabour />
      </PrivateRoute>
    ))
    .with({ name: "ReportsSales" }, () => (
      <PrivateRoute>
        <ReportsSales />
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
    .with({ name: "SettingsDevices" }, () => (
      <PrivateRoute>
        <Devices />
      </PrivateRoute>
    ))
    .with({ name: "CFDLogin" }, () => <CFDLogin />)
    .with({ name: "CFD" }, () => (
      <CFDPrivateRoute>
        <CFDHome />
      </CFDPrivateRoute>
    ))
    .otherwise(() => "Not found");
};
