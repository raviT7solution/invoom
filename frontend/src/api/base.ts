/* eslint-disable */

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ISO8601Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Addons = {
  deliveryPrice: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  restaurant: Restaurant;
  takeoutPrice: Scalars['Float']['output'];
  visible: Scalars['Boolean']['output'];
};

export type AddonsAttributes = {
  deliveryPrice?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  takeoutPrice?: InputMaybe<Scalars['Float']['input']>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AddonsCreateInput = {
  attributes: AddonsAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  restaurantId: Scalars['ID']['input'];
};

export type AddonsDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type AddonsUpdateInput = {
  attributes: AddonsAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type Admin = {
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  restaurants: Array<Restaurant>;
};

export type AdminSessionCreateSubjectEnum =
  | 'mobile'
  | 'web';

export type Category = {
  id: Scalars['ID']['output'];
  items: Array<Item>;
  menuIds: Array<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  restaurant: Restaurant;
  visible: Scalars['Boolean']['output'];
};

export type CategoryAttributes = {
  menuIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CategoryCreateInput = {
  attributes: CategoryAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  restaurantId: Scalars['ID']['input'];
};

export type CategoryDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type CategoryUpdateInput = {
  attributes: CategoryAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type City = {
  name: Scalars['String']['output'];
};

export type Country = {
  alpha2: Scalars['String']['output'];
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  timezones: Array<Timezone>;
};

export type FloorObject = {
  data: Scalars['JSON']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  objectType: Scalars['String']['output'];
};

export type FloorObjectAttributes = {
  data?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  objectType?: InputMaybe<Scalars['String']['input']>;
};

export type FloorObjectUpdateInput = {
  attributes: Array<FloorObjectAttributes>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  restaurantId: Scalars['ID']['input'];
};

export type Item = {
  addonIds: Array<Scalars['ID']['output']>;
  categoryId: Scalars['ID']['output'];
  costOfProduction: Scalars['Float']['output'];
  deliveryPrice: Scalars['Float']['output'];
  description: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  modifierIds: Array<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  takeOutPrice: Scalars['Float']['output'];
  visible: Scalars['Boolean']['output'];
};

export type ItemAttributes = {
  addonIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  costOfProduction?: InputMaybe<Scalars['Float']['input']>;
  deliveryPrice?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  modifierIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  takeOutPrice?: InputMaybe<Scalars['Float']['input']>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ItemCreateInput = {
  attributes: ItemAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  restaurantId: Scalars['ID']['input'];
};

export type ItemDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type ItemUpdateInput = {
  attributes: ItemAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type Menu = {
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  visible: Scalars['Boolean']['output'];
};

export type MenuAttributes = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MenuCreateInput = {
  attributes: MenuAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  restaurantId: Scalars['ID']['input'];
};

export type MenuDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type MenuUpdateInput = {
  attributes: MenuAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type Modifier = {
  categoryIds: Array<Scalars['ID']['output']>;
  globalModifier: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  itemIds: Array<Scalars['ID']['output']>;
  multiSelect: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  values: Array<Scalars['String']['output']>;
  visible: Scalars['Boolean']['output'];
};

export type ModifierAttributes = {
  categoryIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  globalModifier?: InputMaybe<Scalars['Boolean']['input']>;
  itemIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  multiSelect?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  values: Array<Scalars['String']['input']>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ModifierCreateInput = {
  attributes: ModifierAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  restaurantId: Scalars['ID']['input'];
};

export type ModifierDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type ModifierUpdateInput = {
  attributes: ModifierAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type Mutation = {
  addonsCreate: Scalars['Boolean']['output'];
  addonsDelete: Scalars['Boolean']['output'];
  addonsUpdate: Scalars['Boolean']['output'];
  adminSessionCreate: Session;
  categoryCreate: Scalars['Boolean']['output'];
  categoryDelete: Scalars['Boolean']['output'];
  categoryUpdate: Scalars['Boolean']['output'];
  floorObjectUpdate: Scalars['Boolean']['output'];
  itemCreate: Scalars['Boolean']['output'];
  itemDelete: Scalars['Boolean']['output'];
  itemUpdate: Scalars['Boolean']['output'];
  menuCreate: Scalars['Boolean']['output'];
  menuDelete: Scalars['Boolean']['output'];
  menuUpdate: Scalars['Boolean']['output'];
  modifierCreate: Scalars['Boolean']['output'];
  modifierDelete: Scalars['Boolean']['output'];
  modifierUpdate: Scalars['Boolean']['output'];
  roleCreate: Role;
  roleDelete: Role;
  roleUpdate: Role;
  userCreate: Scalars['Boolean']['output'];
  userDelete: User;
  userUpdate: Scalars['Boolean']['output'];
};


export type MutationAddonsCreateArgs = {
  input: AddonsCreateInput;
};


export type MutationAddonsDeleteArgs = {
  input: AddonsDeleteInput;
};


export type MutationAddonsUpdateArgs = {
  input: AddonsUpdateInput;
};


export type MutationAdminSessionCreateArgs = {
  input: SessionCreateInput;
};


export type MutationCategoryCreateArgs = {
  input: CategoryCreateInput;
};


export type MutationCategoryDeleteArgs = {
  input: CategoryDeleteInput;
};


export type MutationCategoryUpdateArgs = {
  input: CategoryUpdateInput;
};


export type MutationFloorObjectUpdateArgs = {
  input: FloorObjectUpdateInput;
};


export type MutationItemCreateArgs = {
  input: ItemCreateInput;
};


export type MutationItemDeleteArgs = {
  input: ItemDeleteInput;
};


export type MutationItemUpdateArgs = {
  input: ItemUpdateInput;
};


export type MutationMenuCreateArgs = {
  input: MenuCreateInput;
};


export type MutationMenuDeleteArgs = {
  input: MenuDeleteInput;
};


export type MutationMenuUpdateArgs = {
  input: MenuUpdateInput;
};


export type MutationModifierCreateArgs = {
  input: ModifierCreateInput;
};


export type MutationModifierDeleteArgs = {
  input: ModifierDeleteInput;
};


export type MutationModifierUpdateArgs = {
  input: ModifierUpdateInput;
};


export type MutationRoleCreateArgs = {
  input: RoleCreateInput;
};


export type MutationRoleDeleteArgs = {
  input: RoleDeleteInput;
};


export type MutationRoleUpdateArgs = {
  input: RoleUpdateInput;
};


export type MutationUserCreateArgs = {
  input: UserCreateInput;
};


export type MutationUserDeleteArgs = {
  input: UserDeleteInput;
};


export type MutationUserUpdateArgs = {
  input: UserUpdateInput;
};

export type Province = {
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Query = {
  addon: Addons;
  addons: Array<Addons>;
  categories: Array<Category>;
  category: Category;
  cities: Array<City>;
  countries: Array<Country>;
  currentAdmin: Admin;
  floorObjects: Array<FloorObject>;
  item: Item;
  items: Array<Item>;
  menu: Menu;
  menus: Array<Menu>;
  modifier: Modifier;
  modifiers: Array<Modifier>;
  provinces: Array<Province>;
  role: Role;
  roles: Array<Role>;
  user: User;
};


export type QueryAddonArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAddonsArgs = {
  restaurantId: Scalars['ID']['input'];
};


export type QueryCategoriesArgs = {
  restaurantId: Scalars['ID']['input'];
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCitiesArgs = {
  alpha2: Scalars['String']['input'];
  provinceCode: Scalars['String']['input'];
};


export type QueryFloorObjectsArgs = {
  restaurantId: Scalars['ID']['input'];
};


export type QueryItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryItemsArgs = {
  restaurantId: Scalars['ID']['input'];
};


export type QueryMenuArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMenusArgs = {
  restaurantId: Scalars['ID']['input'];
};


export type QueryModifierArgs = {
  id: Scalars['ID']['input'];
};


export type QueryModifiersArgs = {
  restaurantId: Scalars['ID']['input'];
};


export type QueryProvincesArgs = {
  alpha2: Scalars['String']['input'];
};


export type QueryRoleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRolesArgs = {
  restaurantId: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Restaurant = {
  address?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Role = {
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Scalars['String']['output']>;
  users: Array<User>;
};

export type RoleAttributes = {
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type RoleCreateInput = {
  attributes: RoleAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  restaurantId: Scalars['ID']['input'];
};

export type RoleDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type RoleUpdateInput = {
  attributes: RoleAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type Session = {
  token: Scalars['String']['output'];
};

export type SessionCreateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  subject: AdminSessionCreateSubjectEnum;
};

export type Timezone = {
  identifier: Scalars['String']['output'];
  offset: Scalars['Int']['output'];
};

export type User = {
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  countryCode: Scalars['String']['output'];
  email: Scalars['String']['output'];
  employmentType: Scalars['String']['output'];
  endDate?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  maxHour: Scalars['Float']['output'];
  phoneNumber: Scalars['String']['output'];
  preferredName: Scalars['String']['output'];
  province?: Maybe<Scalars['String']['output']>;
  roleIds: Array<Scalars['ID']['output']>;
  startDate: Scalars['ISO8601Date']['output'];
  wage: Scalars['Float']['output'];
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type UserAttributes = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  countryCode?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  employmentType?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  maxHour?: InputMaybe<Scalars['Float']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  pin?: InputMaybe<Scalars['String']['input']>;
  preferredName?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  roleIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  wage?: InputMaybe<Scalars['Float']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type UserCreateInput = {
  attributes: UserAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  restaurantId: Scalars['ID']['input'];
};

export type UserDeleteInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type UserUpdateInput = {
  attributes: UserAttributes;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type AdminSessionCreateMutationVariables = Exact<{
  input: SessionCreateInput;
}>;


export type AdminSessionCreateMutation = { adminSessionCreate: { token: string } };

export type CurrentAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentAdminQuery = { currentAdmin: { restaurants: Array<{ id: string, name: string }> } };

export type RoleCreateMutationVariables = Exact<{
  input: RoleCreateInput;
}>;


export type RoleCreateMutation = { roleCreate: { id: string } };

export type RoleUpdateMutationVariables = Exact<{
  input: RoleUpdateInput;
}>;


export type RoleUpdateMutation = { roleUpdate: { id: string } };

export type RoleDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RoleDeleteMutation = { roleDelete: { id: string } };

export type RoleQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RoleQuery = { role: { id: string, name: string, permissions: Array<string> } };

export type RolesQueryVariables = Exact<{
  restaurantId: Scalars['ID']['input'];
}>;


export type RolesQuery = { roles: Array<{ id: string, name: string, users: Array<{ id: string, fullName: string }> }> };

export type UserCreateMutationVariables = Exact<{
  input: UserCreateInput;
}>;


export type UserCreateMutation = { userCreate: boolean };

export type UserUpdateMutationVariables = Exact<{
  input: UserUpdateInput;
}>;


export type UserUpdateMutation = { userUpdate: boolean };

export type UserDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UserDeleteMutation = { userDelete: { id: string } };

export type UserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UserQuery = { user: { address?: string | null, city?: string | null, country?: string | null, countryCode: string, email: string, employmentType: string, endDate?: string | null, firstName: string, fullName: string, gender: string, id: string, lastName: string, maxHour: number, phoneNumber: string, preferredName: string, province?: string | null, roleIds: Array<string>, startDate: any, wage: number, zipCode?: string | null } };

export type FloorObjectsQueryVariables = Exact<{
  restaurantId: Scalars['ID']['input'];
}>;


export type FloorObjectsQuery = { floorObjects: Array<{ id: string, name: string, objectType: string, data: any }> };

export type FloorObjectUpdateMutationVariables = Exact<{
  input: FloorObjectUpdateInput;
}>;


export type FloorObjectUpdateMutation = { floorObjectUpdate: boolean };

export type MenusQueryVariables = Exact<{
  restaurantId: Scalars['ID']['input'];
}>;


export type MenusQuery = { menus: Array<{ id: string, name: string, visible: boolean, description: string }> };

export type MenuQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MenuQuery = { menu: { id: string, name: string, visible: boolean, description: string } };

export type MenuCreateMutationVariables = Exact<{
  input: MenuCreateInput;
}>;


export type MenuCreateMutation = { menuCreate: boolean };

export type MenuDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MenuDeleteMutation = { menuDelete: boolean };

export type MenuUpdateMutationVariables = Exact<{
  input: MenuUpdateInput;
}>;


export type MenuUpdateMutation = { menuUpdate: boolean };

export type CreateCategoryMutationVariables = Exact<{
  input: CategoryCreateInput;
}>;


export type CreateCategoryMutation = { categoryCreate: boolean };

export type CategoriesQueryVariables = Exact<{
  restaurantId: Scalars['ID']['input'];
}>;


export type CategoriesQuery = { categories: Array<{ id: string, name: string, visible: boolean, menuIds: Array<string>, items: Array<{ addonIds: Array<string>, categoryId: string, costOfProduction: number, deliveryPrice: number, description: string, displayName: string, id: string, name: string, price: number, takeOutPrice: number, visible: boolean }> }> };

export type CategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CategoryQuery = { category: { id: string, name: string, visible: boolean, menuIds: Array<string> } };

export type CategoryUpdateMutationVariables = Exact<{
  input: CategoryUpdateInput;
}>;


export type CategoryUpdateMutation = { categoryUpdate: boolean };

export type CategoryDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CategoryDeleteMutation = { categoryDelete: boolean };

export type AddonsQueryVariables = Exact<{
  restaurantId: Scalars['ID']['input'];
}>;


export type AddonsQuery = { addons: Array<{ id: string, name: string, price: number, takeoutPrice: number, deliveryPrice: number, visible: boolean }> };

export type AddonQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AddonQuery = { addon: { id: string, name: string, price: number, takeoutPrice: number, deliveryPrice: number, visible: boolean } };

export type AddonsCreateMutationVariables = Exact<{
  input: AddonsCreateInput;
}>;


export type AddonsCreateMutation = { addonsCreate: boolean };

export type AddonsUpdateMutationVariables = Exact<{
  input: AddonsUpdateInput;
}>;


export type AddonsUpdateMutation = { addonsUpdate: boolean };

export type AddonsDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AddonsDeleteMutation = { addonsDelete: boolean };

export type ItemCreateMutationVariables = Exact<{
  input: ItemCreateInput;
}>;


export type ItemCreateMutation = { itemCreate: boolean };

export type ItemsQueryVariables = Exact<{
  restaurantId: Scalars['ID']['input'];
}>;


export type ItemsQuery = { items: Array<{ addonIds: Array<string>, categoryId: string, costOfProduction: number, deliveryPrice: number, description: string, displayName: string, id: string, modifierIds: Array<string>, name: string, price: number, takeOutPrice: number, visible: boolean }> };

export type ItemQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ItemQuery = { item: { addonIds: Array<string>, categoryId: string, costOfProduction: number, deliveryPrice: number, description: string, displayName: string, id: string, modifierIds: Array<string>, name: string, price: number, takeOutPrice: number, visible: boolean } };

export type ItemUpdateMutationVariables = Exact<{
  input: ItemUpdateInput;
}>;


export type ItemUpdateMutation = { itemUpdate: boolean };

export type ItemDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ItemDeleteMutation = { itemDelete: boolean };

export type ModifiersQueryVariables = Exact<{
  restaurantId: Scalars['ID']['input'];
}>;


export type ModifiersQuery = { modifiers: Array<{ categoryIds: Array<string>, globalModifier: boolean, id: string, itemIds: Array<string>, multiSelect: boolean, name: string, values: Array<string>, visible: boolean }> };

export type ModifierQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ModifierQuery = { modifier: { categoryIds: Array<string>, globalModifier: boolean, id: string, itemIds: Array<string>, multiSelect: boolean, name: string, values: Array<string>, visible: boolean } };

export type ModifierCreateMutationVariables = Exact<{
  input: ModifierCreateInput;
}>;


export type ModifierCreateMutation = { modifierCreate: boolean };

export type ModifierUpdateMutationVariables = Exact<{
  input: ModifierUpdateInput;
}>;


export type ModifierUpdateMutation = { modifierUpdate: boolean };

export type ModifierDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ModifierDeleteMutation = { modifierDelete: boolean };

export type CountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesQuery = { countries: Array<{ alpha2: string, code: string, name: string }> };

export type ProvincesQueryVariables = Exact<{
  alpha2: Scalars['String']['input'];
}>;


export type ProvincesQuery = { provinces: Array<{ code: string, name: string }> };

export type CitiesQueryVariables = Exact<{
  alpha2: Scalars['String']['input'];
  provinceCode: Scalars['String']['input'];
}>;


export type CitiesQuery = { cities: Array<{ name: string }> };


export const AdminSessionCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminSessionCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SessionCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminSessionCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<AdminSessionCreateMutation, AdminSessionCreateMutationVariables>;
export const CurrentAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"currentAdmin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentAdmin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restaurants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CurrentAdminQuery, CurrentAdminQueryVariables>;
export const RoleCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"roleCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RoleCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RoleCreateMutation, RoleCreateMutationVariables>;
export const RoleUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"roleUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RoleUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RoleUpdateMutation, RoleUpdateMutationVariables>;
export const RoleDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"roleDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RoleDeleteMutation, RoleDeleteMutationVariables>;
export const RoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"role"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]} as unknown as DocumentNode<RoleQuery, RoleQueryVariables>;
export const RolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"roles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<RolesQuery, RolesQueryVariables>;
export const UserCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"userCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UserCreateMutation, UserCreateMutationVariables>;
export const UserUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"userUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UserUpdateMutation, UserUpdateMutationVariables>;
export const UserDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"userDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UserDeleteMutation, UserDeleteMutationVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"user"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"employmentType"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"maxHour"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"preferredName"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"roleIds"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"wage"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const FloorObjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"floorObjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"floorObjects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectType"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<FloorObjectsQuery, FloorObjectsQueryVariables>;
export const FloorObjectUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"floorObjectUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FloorObjectUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"floorObjectUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<FloorObjectUpdateMutation, FloorObjectUpdateMutationVariables>;
export const MenusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"menus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<MenusQuery, MenusQueryVariables>;
export const MenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"menu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<MenuQuery, MenuQueryVariables>;
export const MenuCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"menuCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MenuCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<MenuCreateMutation, MenuCreateMutationVariables>;
export const MenuDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"menuDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}]}}]} as unknown as DocumentNode<MenuDeleteMutation, MenuDeleteMutationVariables>;
export const MenuUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"menuUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MenuUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<MenuUpdateMutation, MenuUpdateMutationVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const CategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"categories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"menuIds"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addonIds"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"costOfProduction"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryPrice"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"takeOutPrice"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}}]}}]}}]}}]} as unknown as DocumentNode<CategoriesQuery, CategoriesQueryVariables>;
export const CategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"category"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"menuIds"}}]}}]}}]} as unknown as DocumentNode<CategoryQuery, CategoryQueryVariables>;
export const CategoryUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"categoryUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CategoryUpdateMutation, CategoryUpdateMutationVariables>;
export const CategoryDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"categoryDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}]}}]} as unknown as DocumentNode<CategoryDeleteMutation, CategoryDeleteMutationVariables>;
export const AddonsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"addons"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"takeoutPrice"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryPrice"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}}]}}]}}]} as unknown as DocumentNode<AddonsQuery, AddonsQueryVariables>;
export const AddonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"addon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"takeoutPrice"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryPrice"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}}]}}]}}]} as unknown as DocumentNode<AddonQuery, AddonQueryVariables>;
export const AddonsCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addonsCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddonsCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addonsCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AddonsCreateMutation, AddonsCreateMutationVariables>;
export const AddonsUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addonsUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddonsUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addonsUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AddonsUpdateMutation, AddonsUpdateMutationVariables>;
export const AddonsDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addonsDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addonsDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}]}}]} as unknown as DocumentNode<AddonsDeleteMutation, AddonsDeleteMutationVariables>;
export const ItemCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"itemCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ItemCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ItemCreateMutation, ItemCreateMutationVariables>;
export const ItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"items"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addonIds"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"costOfProduction"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryPrice"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"modifierIds"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"takeOutPrice"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}}]}}]}}]} as unknown as DocumentNode<ItemsQuery, ItemsQueryVariables>;
export const ItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"item"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addonIds"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"costOfProduction"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryPrice"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"modifierIds"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"takeOutPrice"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}}]}}]}}]} as unknown as DocumentNode<ItemQuery, ItemQueryVariables>;
export const ItemUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"itemUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ItemUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ItemUpdateMutation, ItemUpdateMutationVariables>;
export const ItemDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"itemDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}]}}]} as unknown as DocumentNode<ItemDeleteMutation, ItemDeleteMutationVariables>;
export const ModifiersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"modifiers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modifiers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryIds"}},{"kind":"Field","name":{"kind":"Name","value":"globalModifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"itemIds"}},{"kind":"Field","name":{"kind":"Name","value":"multiSelect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"values"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}}]}}]}}]} as unknown as DocumentNode<ModifiersQuery, ModifiersQueryVariables>;
export const ModifierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"modifier"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryIds"}},{"kind":"Field","name":{"kind":"Name","value":"globalModifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"itemIds"}},{"kind":"Field","name":{"kind":"Name","value":"multiSelect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"values"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}}]}}]}}]} as unknown as DocumentNode<ModifierQuery, ModifierQueryVariables>;
export const ModifierCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"modifierCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ModifierCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modifierCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ModifierCreateMutation, ModifierCreateMutationVariables>;
export const ModifierUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"modifierUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ModifierUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modifierUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ModifierUpdateMutation, ModifierUpdateMutationVariables>;
export const ModifierDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"modifierDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modifierDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}]}}]} as unknown as DocumentNode<ModifierDeleteMutation, ModifierDeleteMutationVariables>;
export const CountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"alpha2"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CountriesQuery, CountriesQueryVariables>;
export const ProvincesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"provinces"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"alpha2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"provinces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"alpha2"},"value":{"kind":"Variable","name":{"kind":"Name","value":"alpha2"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ProvincesQuery, ProvincesQueryVariables>;
export const CitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"cities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"alpha2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provinceCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"alpha2"},"value":{"kind":"Variable","name":{"kind":"Name","value":"alpha2"}}},{"kind":"Argument","name":{"kind":"Name","value":"provinceCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provinceCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CitiesQuery, CitiesQueryVariables>;