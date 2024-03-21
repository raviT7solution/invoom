# frozen_string_literal: true

class Types::QueryType < Types::BaseObject
  field :addon, Types::AddonsType, null: false, authorize: "AddonPolicy#show?" do
    argument :id, ID, required: true
  end
  field :addons, [Types::AddonsType], null: false, authorize: "AddonPolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :categories, [Types::CategoryType], null: false, authorize: "CategoryPolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :category, Types::CategoryType, null: false, authorize: "CategoryPolicy#show?" do
    argument :id, ID, required: true
  end
  field :cities, [Types::CityType], null: false do
    argument :alpha2, String, required: true
    argument :province_code, String, required: true
  end
  field :countries, [Types::CountryType], null: false
  field :current_admin, Types::AdminType, null: false, authorize: "AdminPolicy#show?"
  field :floor_objects, [Types::FloorObjectType], null: false, authorize: "FloorObjectPolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :item, Types::ItemType, null: false, authorize: "ItemPolicy#show?" do
    argument :id, ID, required: true
  end
  field :items, [Types::ItemType], null: false, authorize: "ItemPolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :menu, Types::MenuType, null: false, authorize: "MenuPolicy#show?" do
    argument :id, ID, required: true
  end
  field :menus, [Types::MenuType], null: false, authorize: "MenuPolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :modifier, Types::ModifierType, null: false, authorize: "ModifierPolicy#show?" do
    argument :id, ID, required: true
  end
  field :modifiers, [Types::ModifierType], null: false, authorize: "ModifierPolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :provinces, [Types::ProvinceType], null: false do
    argument :alpha2, String, required: true
  end
  field :role, Types::RoleType, null: false, authorize: "RolePolicy#show?" do
    argument :id, ID, required: true
  end
  field :roles, [Types::RoleType], null: false, authorize: "RolePolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :user, Types::UserType, null: false, authorize: "UserPolicy#show?" do
    argument :id, ID, required: true
  end

  def addon(id:)
    AddonPolicy.new(context[:current_user]).scope.find(id)
  end

  def addons(restaurant_id:)
    AddonPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)
  end

  def categories(restaurant_id:)
    CategoryPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)
  end

  def category(id:)
    CategoryPolicy.new(context[:current_user]).scope.find(id)
  end

  def cities(alpha2:, province_code:)
    CS.cities(province_code, alpha2).map { |i| { name: i } }
  end

  def countries
    Country.all.map do |i|
      {
        alpha2: i.alpha2,
        code: i.country_code,
        name: i.iso_short_name,
        timezones: i.timezones.zones.map { |z| { identifier: z.identifier, offset: z.utc_offset } }
      }
    end
  end

  def current_admin
    context[:current_user]
  end

  def floor_objects(restaurant_id:)
    FloorObjectPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)
  end

  def item(id:)
    ItemPolicy.new(context[:current_user]).scope.find(id)
  end

  def items(restaurant_id:)
    ItemPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)
  end

  def menu(id:)
    MenuPolicy.new(context[:current_user]).scope.find(id)
  end

  def menus(restaurant_id:)
    MenuPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)
  end

  def modifier(id:)
    ModifierPolicy.new(context[:current_user]).scope.find(id)
  end

  def modifiers(restaurant_id:)
    ModifierPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)
  end

  def provinces(alpha2:)
    Country[alpha2].subdivision_names_with_codes.map do |i|
      { name: i[0], code: i[1] }
    end
  end

  def role(id:)
    RolePolicy.new(context[:current_user]).scope.find(id)
  end

  def roles(restaurant_id:)
    RolePolicy.new(context[:current_user]).scope.joins(:restaurant).where(restaurant: { id: restaurant_id })
  end

  def user(id:)
    UserPolicy.new(context[:current_user]).scope.find(id)
  end
end
