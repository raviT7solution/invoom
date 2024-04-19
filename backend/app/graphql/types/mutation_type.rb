# frozen_string_literal: true

class Types::MutationType < Types::BaseObject
  field :addons_create, mutation: Mutations::AddonsCreate, null: false, authorize: "AddonPolicy#create?"
  field :addons_delete, mutation: Mutations::AddonsDelete, null: false, authorize: "AddonPolicy#delete?"
  field :addons_update, mutation: Mutations::AddonsUpdate, null: false, authorize: "AddonPolicy#update?"
  field :admin_session_create, mutation: Mutations::AdminSessionCreate, null: false
  field :booking_create, mutation: Mutations::BookingCreate, null: false, authorize: "BookingPolicy#create?"
  field :category_create, mutation: Mutations::CategoryCreate, null: false, authorize: "CategoryPolicy#create?"
  field :category_delete, mutation: Mutations::CategoryDelete, null: false, authorize: "CategoryPolicy#delete?"
  field :category_update, mutation: Mutations::CategoryUpdate, null: false, authorize: "CategoryPolicy#update?"
  field :floor_object_update, mutation: Mutations::FloorObjectUpdate, null: false,
                              authorize: "FloorObjectPolicy#update?"
  field :inventory_category_create, mutation: Mutations::InventoryCategoryCreate, null: false,
                                    authorize: "InventoryCategoryPolicy#create?"
  field :inventory_category_delete, mutation: Mutations::InventoryCategoryDelete, null: false,
                                    authorize: "InventoryCategoryPolicy#delete?"
  field :inventory_category_update, mutation: Mutations::InventoryCategoryUpdate, null: false,
                                    authorize: "InventoryCategoryPolicy#update?"
  field :item_create, mutation: Mutations::ItemCreate, null: false, authorize: "ItemPolicy#create?"
  field :item_delete, mutation: Mutations::ItemDelete, null: false, authorize: "ItemPolicy#delete?"
  field :item_update, mutation: Mutations::ItemUpdate, null: false, authorize: "ItemPolicy#update?"
  field :menu_create, mutation: Mutations::MenuCreate, null: false, authorize: "MenuPolicy#create?"
  field :menu_delete, mutation: Mutations::MenuDelete, null: false, authorize: "MenuPolicy#delete?"
  field :menu_update, mutation: Mutations::MenuUpdate, null: false, authorize: "MenuPolicy#update?"
  field :modifier_create, mutation: Mutations::ModifierCreate, null: false, authorize: "ModifierPolicy#create?"
  field :modifier_delete, mutation: Mutations::ModifierDelete, null: false, authorize: "ModifierPolicy#delete?"
  field :modifier_update, mutation: Mutations::ModifierUpdate, null: false, authorize: "ModifierPolicy#update?"
  field :restaurant_create, mutation: Mutations::RestaurantCreate, null: false, authorize: "RestaurantPolicy#create?"
  field :role_create, mutation: Mutations::RoleCreate, null: false, authorize: "RolePolicy#create?"
  field :role_delete, mutation: Mutations::RoleDelete, null: false, authorize: "RolePolicy#update?"
  field :role_update, mutation: Mutations::RoleUpdate, null: false, authorize: "RolePolicy#delete?"
  field :ticket_create, mutation: Mutations::TicketCreate, null: false, authorize: "TicketPolicy#create?"
  field :ticket_items_update, mutation: Mutations::TicketItemsUpdate, null: false, authorize: "TicketItemPolicy#update?"
  field :user_create, mutation: Mutations::UserCreate, null: false, authorize: "UserPolicy#create?"
  field :user_delete, mutation: Mutations::UserDelete, null: false, authorize: "UserPolicy#delete?"
  field :user_session_create, mutation: Mutations::UserSessionCreate, null: false,
                              authorize: "UserSessionPolicy#create?"
  field :user_update, mutation: Mutations::UserUpdate, null: false, authorize: "UserPolicy#update?"
end
