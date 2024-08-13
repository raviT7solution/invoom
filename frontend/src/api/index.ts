import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { GraphQLClient } from "graphql-request";

import {
  AddonDocument,
  AddonsCreateDocument,
  AddonsCreateMutationVariables,
  AddonsDeleteDocument,
  AddonsDeleteMutationVariables,
  AddonsDocument,
  AddonsUpdateDocument,
  AddonsUpdateMutationVariables,
  AdminSessionCreateDocument,
  AdminSessionCreateMutationVariables,
  BookingsDocument,
  BookingsQueryVariables,
  CategoriesDocument,
  CategoryDeleteDocument,
  CategoryDeleteMutationVariables,
  CategoryDocument,
  CategoryUpdateDocument,
  CategoryUpdateMutationVariables,
  ChangePasswordDocument,
  ChangePasswordMutationVariables,
  CitiesDocument,
  CountriesDocument,
  CreateCategoryDocument,
  CreateCategoryMutationVariables,
  CurrentAdminDocument,
  DiscountCreateDocument,
  DiscountCreateMutationVariables,
  DiscountDeleteDocument,
  DiscountDeleteMutationVariables,
  DiscountDocument,
  DiscountUpdateDocument,
  DiscountUpdateMutationVariables,
  DiscountsDocument,
  FloorObjectUpdateDocument,
  FloorObjectUpdateMutationVariables,
  FloorObjectsDocument,
  FloorObjectsQueryVariables,
  InventoryCategoriesDocument,
  InventoryCategoryCreateDocument,
  InventoryCategoryCreateMutationVariables,
  InventoryCategoryDeleteDocument,
  InventoryCategoryDeleteMutationVariables,
  InventoryCategoryDocument,
  InventoryCategoryUpdateDocument,
  InventoryCategoryUpdateMutationVariables,
  InvoicesDocument,
  InvoicesQueryVariables,
  ItemCodeGenerateDocument,
  ItemCodeGenerateMutationVariables,
  ItemCreateDocument,
  ItemCreateMutationVariables,
  ItemDeleteDocument,
  ItemDeleteMutationVariables,
  ItemDocument,
  ItemUpdateDocument,
  ItemUpdateMutationVariables,
  ItemsDocument,
  KitchenProfileCreateDocument,
  KitchenProfileCreateMutationVariables,
  KitchenProfileDeleteDocument,
  KitchenProfileDeleteMutationVariables,
  KitchenProfileDocument,
  KitchenProfileUpdateDocument,
  KitchenProfileUpdateMutationVariables,
  KitchenProfilesDocument,
  MenuCreateDocument,
  MenuCreateMutationVariables,
  MenuDeleteDocument,
  MenuDeleteMutationVariables,
  MenuDocument,
  MenuUpdateDocument,
  MenuUpdateMutationVariables,
  MenusDocument,
  ModifierCreateDocument,
  ModifierCreateMutationVariables,
  ModifierDeleteDocument,
  ModifierDeleteMutationVariables,
  ModifierDocument,
  ModifierUpdateDocument,
  ModifierUpdateMutationVariables,
  ModifiersDocument,
  PrinterConfigurationCreateDocument,
  PrinterConfigurationCreateMutationVariables,
  PrinterConfigurationDeleteDocument,
  PrinterConfigurationDeleteMutationVariables,
  PrinterConfigurationDocument,
  PrinterConfigurationUpdateDocument,
  PrinterConfigurationUpdateMutationVariables,
  PrinterConfigurationsDocument,
  ProductCreateDocument,
  ProductCreateMutationVariables,
  ProductDeleteDocument,
  ProductDeleteMutationVariables,
  ProductDocument,
  ProductUpdateDocument,
  ProductUpdateMutationVariables,
  ProductsDocument,
  ProvincesDocument,
  RestaurantCreateDocument,
  RestaurantCreateMutationVariables,
  RestaurantUpdateDocument,
  RestaurantUpdateMutationVariables,
  RestaurantsDocument,
  RoleCreateDocument,
  RoleCreateMutationVariables,
  RoleDeleteDocument,
  RoleDeleteMutationVariables,
  RoleDocument,
  RoleUpdateDocument,
  RoleUpdateMutationVariables,
  RolesDocument,
  RolesQueryVariables,
  ServiceChargeCreateDocument,
  ServiceChargeCreateMutationVariables,
  ServiceChargeDeleteDocument,
  ServiceChargeDeleteMutationVariables,
  ServiceChargeDocument,
  ServiceChargeUpdateDocument,
  ServiceChargeUpdateMutationVariables,
  ServiceChargesDocument,
  TaxesDocument,
  TimeSheetCreateDocument,
  TimeSheetCreateMutationVariables,
  TimeSheetDeleteDocument,
  TimeSheetDeleteMutationVariables,
  TimeSheetDocument,
  TimeSheetUpdateDocument,
  TimeSheetUpdateMutationVariables,
  TimeSheetsDocument,
  TimeSheetsQueryVariables,
  UserCreateDocument,
  UserCreateMutationVariables,
  UserDeleteDocument,
  UserDeleteMutationVariables,
  UserDocument,
  UserUpdateDocument,
  UserUpdateMutationVariables,
  UsersDocument,
} from "./base";

import { Router } from "../Routes";
import { useAdminSessionStore } from "../stores/useAdminSessionStore";

const client = new GraphQLClient(
  `${import.meta.env.VITE_BACKEND_BASE_URL}/graphql`,
  {
    headers: () => ({
      Authorization: useAdminSessionStore.getState().token
        ? `Bearer ${useAdminSessionStore.getState().token}`
        : "",
    }),
    responseMiddleware: (r) => {
      if (
        "response" in r &&
        r.response.errors?.map((i) => i.message).join("") ===
          "Session not found"
      ) {
        useAdminSessionStore.getState().destroy();
        Router.push("Login");

        return;
      }

      if ("response" in r && r.response.errors) {
        notification.error({
          message: r.response.errors.map((e) => e.message).join(", "),
        });
      }
    },
  },
);

const collectionInitialData = {
  collection: [],
  metadata: {
    currentPage: 1,
    limitValue: 0,
    totalCount: 0,
    totalPages: 0,
  },
};

export const useAdminSessionCreate = () => {
  return useMutation({
    mutationFn: (variables: AdminSessionCreateMutationVariables) =>
      client.request(AdminSessionCreateDocument, variables),
  });
};

export const useCurrentAdmin = () => {
  return useQuery({
    queryFn: async () =>
      (await client.request(CurrentAdminDocument)).currentAdmin,
    queryKey: ["currentAdmin"],
  });
};

export const useRestaurants = (status: string) => {
  return useQuery({
    initialData: [],
    queryKey: ["restaurants", status],
    queryFn: async () =>
      (await client.request(RestaurantsDocument, { status })).restaurants,
  });
};

export const useRoleCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: RoleCreateMutationVariables) =>
      client.request(RoleCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useRoleUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: RoleUpdateMutationVariables) =>
      client.request(RoleUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useRoleDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: RoleDeleteMutationVariables) =>
      client.request(RoleDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useRole = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["role", id],
    queryFn: async () => (await client.request(RoleDocument, { id: id })).role,
  });
};

export const useRoles = (variables: RolesQueryVariables) => {
  return useQuery({
    enabled: variables.restaurantId !== "",
    initialData: [],
    queryKey: ["roles", variables],
    queryFn: async () => (await client.request(RolesDocument, variables)).roles,
  });
};

export const useUserCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UserCreateMutationVariables) =>
      client.request(UserCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useUserUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UserUpdateMutationVariables) =>
      client.request(UserUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useUserDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UserDeleteMutationVariables) =>
      client.request(UserDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useUser = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["user", id],
    queryFn: async () => (await client.request(UserDocument, { id })).user,
  });
};

export const useFloorObjects = (variables: FloorObjectsQueryVariables) => {
  return useQuery({
    enabled: variables.restaurantId !== "",
    initialData: [],
    queryKey: ["floorObjects", variables],
    queryFn: async () =>
      (await client.request(FloorObjectsDocument, variables)).floorObjects,
  });
};

export const useFloorObjectUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: FloorObjectUpdateMutationVariables) =>
      client.request(FloorObjectUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorObjects"] });
    },
  });
};

export const useMenus = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryFn: async () =>
      (await client.request(MenusDocument, { restaurantId })).menus,
    queryKey: ["menus", restaurantId],
  });
};

export const useMenu = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryFn: async () => (await client.request(MenuDocument, { id })).menu,
    queryKey: ["menu", id],
  });
};

export const useMenuCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: MenuCreateMutationVariables) =>
      client.request(MenuCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
};

export const useMenuDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: MenuDeleteMutationVariables) =>
      client.request(MenuDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
};

export const useMenuUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: MenuUpdateMutationVariables) =>
      client.request(MenuUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
};

export const useCategoryCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateCategoryMutationVariables) =>
      client.request(CreateCategoryDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useCategories = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryFn: async () =>
      (await client.request(CategoriesDocument, { restaurantId })).categories,
    queryKey: ["categories", restaurantId],
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["categorie", id],
    queryFn: async () =>
      (await client.request(CategoryDocument, { id: id })).category,
  });
};

export const useCategoryUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CategoryUpdateMutationVariables) =>
      client.request(CategoryUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useCategoryDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CategoryDeleteMutationVariables) =>
      client.request(CategoryDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useAddons = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryKey: ["addons", restaurantId],
    queryFn: async () =>
      (await client.request(AddonsDocument, { restaurantId })).addons,
  });
};

export const useAddon = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["addon", id],
    queryFn: async () =>
      (await client.request(AddonDocument, { id: id })).addon,
  });
};

export const useAddonsCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: AddonsCreateMutationVariables) =>
      client.request(AddonsCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
};

export const useAddonsUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: AddonsUpdateMutationVariables) =>
      client.request(AddonsUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
};

export const useAddonsDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: AddonsDeleteMutationVariables) =>
      client.request(AddonsDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
};

export const useRestaurantCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: RestaurantCreateMutationVariables) =>
      client.request(RestaurantCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
};

export const useItemCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ItemCreateMutationVariables) =>
      client.request(ItemCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useItem = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["item", id],
    queryFn: async () => (await client.request(ItemDocument, { id: id })).item,
  });
};

export const useItems = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryKey: ["items", restaurantId],
    queryFn: async () =>
      (await client.request(ItemsDocument, { restaurantId })).items,
  });
};

export const useItemUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ItemUpdateMutationVariables) =>
      client.request(ItemUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useItemDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ItemDeleteMutationVariables) =>
      client.request(ItemDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useModifiers = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryKey: ["modifiers", restaurantId],
    queryFn: async () =>
      (await client.request(ModifiersDocument, { restaurantId })).modifiers,
  });
};

export const useModifierDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ModifierDeleteMutationVariables) =>
      client.request(ModifierDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modifiers"] });
    },
  });
};

export const useModifier = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["modifier", id],
    queryFn: async () =>
      (await client.request(ModifierDocument, { id: id })).modifier,
  });
};

export const useModifierCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ModifierCreateMutationVariables) =>
      client.request(ModifierCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modifiers"] });
    },
  });
};

export const useModifierUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ModifierUpdateMutationVariables) =>
      client.request(ModifierUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modifiers"] });
    },
  });
};

export const useCountries = () => {
  return useQuery({
    initialData: [],
    queryKey: ["countries"],
    queryFn: async () => (await client.request(CountriesDocument)).countries,
  });
};

export const useProvinces = (alpha2: string) => {
  return useQuery({
    initialData: [],
    enabled: alpha2 !== "",
    queryKey: ["provinces", alpha2],
    queryFn: async () =>
      (await client.request(ProvincesDocument, { alpha2: alpha2 })).provinces,
  });
};

export const useCities = (alpha2: string, provinceCode: string) => {
  return useQuery({
    initialData: [],
    enabled: alpha2 !== "" && provinceCode !== "",
    queryKey: ["cities", alpha2, provinceCode],
    queryFn: async () =>
      (
        await client.request(CitiesDocument, {
          alpha2: alpha2,
          provinceCode: provinceCode,
        })
      ).cities,
  });
};

export const useInventoryCategoryCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: InventoryCategoryCreateMutationVariables) =>
      client.request(InventoryCategoryCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryCategories"] });
    },
  });
};

export const useInventoryCategories = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryFn: async () =>
      (await client.request(InventoryCategoriesDocument, { restaurantId }))
        .inventoryCategories,
    queryKey: ["inventoryCategories", restaurantId],
  });
};

export const useInventoryCategory = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["inventoryCategory", id],
    queryFn: async () =>
      (await client.request(InventoryCategoryDocument, { id: id }))
        .inventoryCategory,
  });
};

export const useInventoryCategoryUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: InventoryCategoryUpdateMutationVariables) =>
      client.request(InventoryCategoryUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryCategories"] });
    },
  });
};
export const useInventoryCategoryDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: InventoryCategoryDeleteMutationVariables) =>
      client.request(InventoryCategoryDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryCategories"] });
    },
  });
};

export const useRestaurantUpdate = () => {
  return useMutation({
    mutationFn: (variables: RestaurantUpdateMutationVariables) =>
      client.request(RestaurantUpdateDocument, variables),
  });
};

export const useTimeSheets = (variables: TimeSheetsQueryVariables) => {
  return useQuery({
    initialData: collectionInitialData,
    queryKey: ["timeSheets", variables],
    queryFn: async () =>
      (await client.request(TimeSheetsDocument, variables)).timeSheets,
  });
};

export const useUsers = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryKey: ["users", restaurantId],
    queryFn: async () =>
      (await client.request(UsersDocument, { restaurantId })).users,
  });
};

export const useSettingsTaxes = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryFn: async () =>
      (await client.request(TaxesDocument, { restaurantId })).taxes,
    queryKey: ["taxes", restaurantId],
  });
};

export const useProductCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ProductCreateMutationVariables) =>
      client.request(ProductCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useProducts = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryFn: async () =>
      (await client.request(ProductsDocument, { restaurantId })).products,
    queryKey: ["products", restaurantId],
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["product", id],
    queryFn: async () =>
      (await client.request(ProductDocument, { id: id })).product,
  });
};

export const useProductDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ProductDeleteMutationVariables) =>
      client.request(ProductDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useProductUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ProductUpdateMutationVariables) =>
      client.request(ProductUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useItemCodeGenerate = () => {
  return useMutation({
    mutationFn: (variables: ItemCodeGenerateMutationVariables) =>
      client.request(ItemCodeGenerateDocument, variables),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (variables: ChangePasswordMutationVariables) =>
      client.request(ChangePasswordDocument, variables),
  });
};

export const useKitchenProfile = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["kitchenProfile", id],
    queryFn: async () =>
      (await client.request(KitchenProfileDocument, { id: id })).kitchenProfile,
  });
};

export const useKitchenProfiles = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryKey: ["kitchenProfiles", restaurantId],
    queryFn: async () =>
      (
        await client.request(KitchenProfilesDocument, {
          restaurantId: restaurantId,
        })
      ).kitchenProfiles,
  });
};

export const useKitchenProfileCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: KitchenProfileCreateMutationVariables) =>
      client.request(KitchenProfileCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kitchenProfiles"] });
    },
  });
};

export const useKitchenProfileUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: KitchenProfileUpdateMutationVariables) =>
      client.request(KitchenProfileUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kitchenProfiles"] });
    },
  });
};

export const useKitchenProfileDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: KitchenProfileDeleteMutationVariables) =>
      client.request(KitchenProfileDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kitchenProfiles"] });
    },
  });
};

export const useDiscounts = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryKey: ["discounts", restaurantId],
    queryFn: async () =>
      (await client.request(DiscountsDocument, { restaurantId })).discounts,
  });
};

export const useDiscount = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["discount", id],
    queryFn: async () =>
      (await client.request(DiscountDocument, { id: id })).discount,
  });
};

export const useDiscountCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DiscountCreateMutationVariables) =>
      client.request(DiscountCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

export const useDiscountUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DiscountUpdateMutationVariables) =>
      client.request(DiscountUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

export const useDiscountDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DiscountDeleteMutationVariables) =>
      client.request(DiscountDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

export const usePrinterConfigurationCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: PrinterConfigurationCreateMutationVariables) =>
      client.request(PrinterConfigurationCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["printerConfigurations"] });
    },
  });
};

export const usePrinterConfigurations = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryFn: async () =>
      (await client.request(PrinterConfigurationsDocument, { restaurantId }))
        .printerConfigurations,
    queryKey: ["printerConfigurations", restaurantId],
  });
};

export const usePrinterConfiguration = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["printerConfiguration", id],
    queryFn: async () =>
      (await client.request(PrinterConfigurationDocument, { id: id }))
        .printerConfiguration,
  });
};

export const usePrinterConfigurationUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: PrinterConfigurationUpdateMutationVariables) =>
      client.request(PrinterConfigurationUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["printerConfigurations"] });
    },
  });
};

export const usePrinterConfigurationDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: PrinterConfigurationDeleteMutationVariables) =>
      client.request(PrinterConfigurationDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["printerConfigurations"] });
    },
  });
};

export const useBookings = (variables: BookingsQueryVariables) => {
  return useQuery({
    initialData: collectionInitialData,
    queryKey: ["bookings", variables],
    queryFn: async () =>
      (await client.request(BookingsDocument, variables)).bookings,
  });
};

export const useInvoices = (variables: InvoicesQueryVariables) => {
  return useQuery({
    initialData: collectionInitialData,
    queryKey: ["invoices", variables],
    queryFn: async () =>
      (await client.request(InvoicesDocument, variables)).invoices,
  });
};

export const useServiceChargeCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ServiceChargeCreateMutationVariables) =>
      client.request(ServiceChargeCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceCharges"] });
    },
  });
};

export const useServiceChargeUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ServiceChargeUpdateMutationVariables) =>
      client.request(ServiceChargeUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceCharges"] });
    },
  });
};

export const useServiceChargeDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ServiceChargeDeleteMutationVariables) =>
      client.request(ServiceChargeDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceCharges"] });
    },
  });
};

export const useServiceCharges = (restaurantId: string) => {
  return useQuery({
    enabled: restaurantId !== "",
    initialData: [],
    queryFn: async () =>
      (await client.request(ServiceChargesDocument, { restaurantId }))
        .serviceCharges,
    queryKey: ["serviceCharges", restaurantId],
  });
};

export const useServiceCharge = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryFn: async () =>
      (await client.request(ServiceChargeDocument, { id })).serviceCharge,
    queryKey: ["serviceCharge", id],
  });
};

export const useTimeSheet = (id: string) => {
  return useQuery({
    enabled: id !== "",
    queryKey: ["timeSheet", id],
    queryFn: async () =>
      (await client.request(TimeSheetDocument, { id })).timeSheet,
  });
};

export const useTimeSheetCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TimeSheetCreateMutationVariables) =>
      client.request(TimeSheetCreateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeSheets"] });
    },
  });
};

export const useTimeSheetDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TimeSheetDeleteMutationVariables) =>
      client.request(TimeSheetDeleteDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeSheets"] });
    },
  });
};

export const useTimeSheetUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TimeSheetUpdateMutationVariables) =>
      client.request(TimeSheetUpdateDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeSheets"] });
    },
  });
};
