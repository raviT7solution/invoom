# frozen_string_literal: true

class Types::QueryType < Types::BaseObject
  field :addon, Types::AddonsType, null: false, authorize: "AddonPolicy#show?" do
    argument :id, ID, required: true
  end
  field :addons, [Types::AddonsType], null: false, authorize: "AddonPolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :booking, Types::BookingType, null: false, authorize: "BookingPolicy#show?" do
    argument :id, ID, required: true
  end
  field :bookings, Types::BookingType.collection_type, null: false, authorize: "BookingPolicy#index?" do
    argument :booking_types, [String], required: true
    argument :end_date, GraphQL::Types::ISO8601DateTime, required: false
    argument :page, Integer, required: true
    argument :per_page, Integer, required: true
    argument :restaurant_id, ID, required: true
    argument :start_date, GraphQL::Types::ISO8601DateTime, required: false
    argument :status, String, required: true
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
  field :current_user, Types::UserType, null: false, authorize: "UserPolicy#show?"
  field :customers, Types::CustomerType.collection_type, null: false, authorize: "CustomerPolicy#index?" do
    argument :page, Integer, required: true
    argument :per_page, Integer, required: true
    argument :query, String, required: true
    argument :restaurant_id, ID, required: true
  end
  field :floor_objects, [Types::FloorObjectType], null: false, authorize: "FloorObjectPolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :inventory_categories, [Types::InventoryCategoryType], null: false,
                                                               authorize: "InventoryCategoryPolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :inventory_category, Types::InventoryCategoryType, null: false, authorize: "InventoryCategoryPolicy#show?" do
    argument :id, ID, required: true
  end
  field :item, Types::ItemType, null: false, authorize: "ItemPolicy#show?" do
    argument :id, ID, required: true
  end
  field :items, [Types::ItemType], null: false, authorize: "ItemPolicy#index?" do
    argument :category_id, ID, required: false
    argument :restaurant_id, ID, required: true
  end
  field :kitchen_profiles, [Types::KitchenProfileType], null: false, authorize: "KitchenProfilePolicy#index?" do
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
  field :product, Types::ProductType, null: false, authorize: "ProductPolicy#show?" do
    argument :id, ID, required: true
  end
  field :products, [Types::ProductType], null: false, authorize: "ProductPolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :provinces, [Types::ProvinceType], null: false do
    argument :alpha2, String, required: true
  end
  field :reservations, Types::ReservationType.collection_type, null: false, authorize: "ReservationPolicy#index?" do
    argument :end_time, GraphQL::Types::ISO8601DateTime, required: false
    argument :page, Integer, required: true
    argument :per_page, Integer, required: true
    argument :restaurant_id, ID, required: true
    argument :start_time, GraphQL::Types::ISO8601DateTime, required: false
    argument :status, String, required: false
  end
  field :restaurants, [Types::RestaurantType], null: false, authorize: "RestaurantPolicy#index?" do
    argument :status, String, required: false
  end
  field :role, Types::RoleType, null: false, authorize: "RolePolicy#show?" do
    argument :id, ID, required: true
  end
  field :roles, [Types::RoleType], null: false, authorize: "RolePolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :taxes, [Types::TaxType], null: false, authorize: "TaxPolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :tickets, Types::TicketType.collection_type, null: false, authorize: "TicketPolicy#index?" do
    argument :booking_types, [String], required: false
    argument :kitchen_profile_id, ID, required: false
    argument :page, Integer, required: true
    argument :per_page, Integer, required: true
    argument :restaurant_id, ID, required: true
    argument :status, [String], required: false
  end
  field :time_sheets, Types::TimeSheetType.collection_type, null: false, authorize: "TimeSheetPolicy#index?" do
    argument :end_date, String, required: false
    argument :page, Integer, required: true
    argument :per_page, Integer, required: true
    argument :restaurant_id, ID, required: true
    argument :start_date, String, required: false
    argument :user_ids, [String], required: false
  end
  field :user, Types::UserType, null: false, authorize: "UserPolicy#show?" do
    argument :id, ID, required: true
  end
  field :users, [Types::UserType], null: false, authorize: "UserPolicy#index?" do
    argument :restaurant_id, ID, required: true
  end

  def addon(id:)
    AddonPolicy.new(context[:current_user]).scope.find(id)
  end

  def addons(restaurant_id:)
    AddonPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)
  end

  def booking(id:)
    BookingPolicy.new(context[:current_user]).scope.find(id)
  end

  def bookings(restaurant_id:, booking_types:, status:, page:, per_page:, start_date: nil, end_date: nil) # rubocop:disable Metrics/ParameterLists, Metrics/AbcSize
    records = BookingPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)

    records = records.where(clocked_in_at: start_date..end_date) if start_date.present? && end_date.present?

    records = records.where(booking_type: booking_types) if booking_types.present?
    records = records.where(clocked_out_at: nil) if status == "current"
    records = records.where.not(clocked_out_at: nil) if status == "completed"

    records.order(created_at: :desc).page(page).per(per_page)
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
        timezones: i.timezones.zones.map do |z|
                     { identifier: z.identifier, humanize_offset: z.strftime("%:z"), offset: z.utc_offset }
                   end
      }
    end
  end

  def current_admin
    current_user = context[:current_user]

    return current_user.web_admin! if current_user.web_admin?
    return current_user.mobile_admin! if current_user.mobile_admin?
    return current_user.kds_admin! if current_user.kds_admin?

    raise GraphQL::ExecutionError, "Unauthorized"
  end

  def current_user
    current_user = context[:current_user]

    return current_user.mobile_user! if current_user.mobile_user?

    raise GraphQL::ExecutionError, "Unauthorized"
  end

  def customers(restaurant_id:, query:, page:, per_page:)
    records = CustomerPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)

    records = records.where("name ILIKE :q OR phone_number ILIKE :q", q: "%#{query}%") if query.present?

    records.order(created_at: :desc).page(page).per(per_page)
  end

  def floor_objects(restaurant_id:)
    FloorObjectPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)
  end

  def inventory_categories(restaurant_id:)
    InventoryCategoryPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)
  end

  def inventory_category(id:)
    InventoryCategoryPolicy.new(context[:current_user]).scope.find(id)
  end

  def item(id:)
    ItemPolicy.new(context[:current_user]).scope.find(id)
  end

  def items(restaurant_id:, category_id: nil)
    records = ItemPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)

    records = records.where(category_id: category_id) if category_id.present?

    records
  end

  def kitchen_profiles(restaurant_id:)
    KitchenProfilePolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)
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

  def product(id:)
    ProductPolicy.new(context[:current_user]).scope.find(id)
  end

  def products(restaurant_id:)
    ProductPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)
  end

  def provinces(alpha2:)
    Country[alpha2].subdivision_names_with_codes.map do |i|
      { name: i[0], code: i[1] }
    end
  end

  def reservations(restaurant_id:, page:, per_page:, status: nil, start_time: nil, end_time: nil) # rubocop:disable Metrics/ParameterLists
    records = ReservationPolicy.new(context[:current_user]).scope
    records = records.where(restaurant_id: restaurant_id)

    records = records.where(status: status) if status.present?
    records = records.where(reservation_at: start_time..end_time) if start_time.present? && end_time.present?

    records.order(:created_at).page(page).per(per_page)
  end

  def restaurants(status: nil)
    records = RestaurantPolicy.new(context[:current_session]).scope

    records = records.where(status: status) if status.present?

    records
  end

  def role(id:)
    RolePolicy.new(context[:current_user]).scope.find(id)
  end

  def roles(restaurant_id:)
    RolePolicy.new(context[:current_user]).scope.joins(:restaurant).where(restaurant: { id: restaurant_id })
  end

  def taxes(restaurant_id:)
    restaurant = RestaurantPolicy.new(context[:current_user]).scope.find(restaurant_id)

    TaxPolicy.new(context[:current_user]).scope.where(province: restaurant.province, country: restaurant.country)
  end

  def tickets(restaurant_id:, page:, per_page:, kitchen_profile_id: nil, booking_types: [], status: []) # rubocop:disable Metrics/AbcSize, Metrics/ParameterLists
    records = TicketPolicy.new(context[:current_user]).scope.joins(booking: :restaurant)
                          .where(restaurants: { id: restaurant_id })

    records = records.where(bookings: { booking_type: booking_types }) if booking_types.present?

    if kitchen_profile_id.present?
      profile = KitchenProfilePolicy.new(context[:current_user]).scope.find(kitchen_profile_id)
      records = records.joins(ticket_items: :item).where(items: { category_id: profile.categories })
    end

    records = records.eager_load(:ticket_items).where(ticket_items: { status: status }) if status.present?

    order_direction = status.include?("served") ? :desc : :asc
    records.order(created_at: order_direction).page(page).per(per_page)
  end

  def time_sheets(restaurant_id:, page:, per_page:, start_date: nil, end_date: nil, user_ids: nil) # rubocop:disable Metrics/ParameterLists, Metrics/AbcSize
    records = TimeSheetPolicy.new(context[:current_user]).scope
    records = records.joins(:user).where(user: { restaurant_id: restaurant_id })

    if user_ids.present?
      records = records.where(user_id: UserPolicy.new(context[:current_user]).scope.where(id: user_ids))
    end

    if start_date.present? && end_date.present?
      records = records.where(start_time: DateTime.parse(start_date)..DateTime.parse(end_date))
    end

    records.order(created_at: :desc).page(page).per(per_page)
  end

  def user(id:)
    UserPolicy.new(context[:current_user]).scope.find(id)
  end

  def users(restaurant_id:)
    UserPolicy.new(context[:current_user]).scope.where(restaurant_id: restaurant_id)
  end
end
