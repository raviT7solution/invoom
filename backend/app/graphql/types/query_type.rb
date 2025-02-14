# frozen_string_literal: true

class Types::QueryType < Types::BaseObject
  field :addon, Types::AddonsType, null: false do
    argument :id, ID, required: true
  end
  field :addons, [Types::AddonsType], null: false do
    argument :restaurant_id, ID, required: true
  end
  field :booking, Types::BookingType, null: false do
    argument :id, ID, required: true
  end
  field :bookings, Types::BookingType.collection_type, null: false do
    argument :booking_types, [String], required: false
    argument :end_date, GraphQL::Types::ISO8601DateTime, required: false
    argument :export, Boolean, required: false
    argument :page, Integer, required: true
    argument :per_page, Integer, required: true
    argument :restaurant_id, ID, required: true
    argument :start_date, GraphQL::Types::ISO8601DateTime, required: false
    argument :status, String, required: false
    argument :table_name, String, required: false
  end
  field :categories, [Types::CategoryType], null: false do
    argument :restaurant_id, ID, required: true
  end
  field :category, Types::CategoryType, null: false do
    argument :id, ID, required: true
  end
  field :cities, [Types::CityType], null: false do
    argument :alpha2, String, required: true
    argument :province_code, String, required: true
  end
  field :countries, [Types::CountryType], null: false
  field :current_admin, Types::AdminType, null: false
  field :current_user, Types::UserType, null: false
  field :customers, Types::CustomerType.collection_type, null: false do
    argument :export, Boolean, required: false
    argument :page, Integer, required: true
    argument :per_page, Integer, required: true
    argument :query, String, required: false
    argument :restaurant_id, ID, required: true
  end
  field :dashboard_summary, Types::DashboardSummaryType, null: false do
    argument :end_time, GraphQL::Types::ISO8601DateTime, required: false
    argument :restaurant_id, ID, required: true
    argument :start_time, GraphQL::Types::ISO8601DateTime, required: false
  end
  field :device, Types::DeviceType, null: false do
    argument :id, ID, required: true
  end
  field :devices, [Types::DeviceType], null: false do
    argument :restaurant_id, ID, required: true
  end
  field :discount, Types::DiscountType, null: false do
    argument :id, ID, required: true
  end
  field :discounts, [Types::DiscountType], null: false do
    argument :channel, Types::Discount::ChannelEnum, required: false
    argument :discount_on, Types::Discount::DiscountOnEnum, required: false
    argument :item_id, ID, required: false
    argument :restaurant_id, ID, required: true
  end
  field :floor_objects, [Types::FloorObjectType], null: false do
    argument :restaurant_id, ID, required: true
  end
  field :inventory_categories, [Types::InventoryCategoryType], null: false do
    argument :restaurant_id, ID, required: true
  end
  field :inventory_category, Types::InventoryCategoryType, null: false do
    argument :id, ID, required: true
  end
  field :invoice, Types::InvoiceType, null: false do
    argument :id, ID, required: true
  end
  field :invoices, Types::InvoiceType.collection_type, null: false do
    argument :booking_types, [String], required: false
    argument :end_date, GraphQL::Types::ISO8601DateTime, required: false
    argument :export, Boolean, required: false
    argument :page, Integer, required: true
    argument :per_page, Integer, required: true
    argument :restaurant_id, ID, required: true
    argument :start_date, GraphQL::Types::ISO8601DateTime, required: false
    argument :status, String, required: false
  end
  field :item, Types::ItemType, null: false do
    argument :id, ID, required: true
  end
  field :items, [Types::ItemType], null: false do
    argument :category_id, ID, required: false
    argument :query, String, required: false
    argument :restaurant_id, ID, required: true
  end
  field :kitchen_profile, Types::KitchenProfileType, null: false do
    argument :id, ID, required: true
  end
  field :kitchen_profiles, [Types::KitchenProfileType], null: false do
    argument :restaurant_id, ID, required: true
  end
  field :menu, Types::MenuType, null: false do
    argument :id, ID, required: true
  end
  field :menus, [Types::MenuType], null: false do
    argument :restaurant_id, ID, required: true
  end
  field :modifier, Types::ModifierType, null: false do
    argument :id, ID, required: true
  end
  field :modifiers, [Types::ModifierType], null: false do
    argument :item_id, ID, required: false
    argument :restaurant_id, ID, required: true
  end
  field :printer_configuration, Types::PrinterConfigurationType, null: false do
    argument :id, ID, required: true
  end
  field :printer_configurations, [Types::PrinterConfigurationType], null: false do
    argument :restaurant_id, ID, required: true
    argument :ticket_id, ID, required: false
  end
  field :product, Types::ProductType, null: false do
    argument :id, ID, required: true
  end
  field :products, Types::ProductType.collection_type, null: false do
    argument :page, Integer, required: true
    argument :per_page, Integer, required: true
    argument :restaurant_id, ID, required: true
  end
  field :provinces, [Types::ProvinceType], null: false do
    argument :alpha2, String, required: true
  end
  field :reservations, [Types::ReservationType], null: false do
    argument :end_time, GraphQL::Types::ISO8601DateTime, required: false
    argument :restaurant_id, ID, required: true
    argument :start_time, GraphQL::Types::ISO8601DateTime, required: false
  end
  field :restaurant, Types::RestaurantType, null: false do
    argument :id, String, required: true
  end
  field :restaurants, [Types::RestaurantType], null: false do
    argument :status, String, required: false
  end
  field :role, Types::RoleType, null: false do
    argument :id, ID, required: true
  end
  field :roles, [Types::RoleType], null: false do
    argument :restaurant_id, ID, required: true
  end
  field :service_charge, Types::ServiceChargeType, null: false do
    argument :id, ID, required: true
  end
  field :service_charges, [Types::ServiceChargeType], null: false do
    argument :restaurant_id, ID, required: true
  end
  field :taxes, [Types::TaxType], null: false do
    argument :restaurant_id, ID, required: true
  end
  field :tickets, Types::TicketType.collection_type, null: false do
    argument :booking_types, [String], required: false
    argument :kitchen_profile_id, ID, required: false
    argument :page, Integer, required: true
    argument :per_page, Integer, required: true
    argument :restaurant_id, ID, required: true
    argument :status, [String], required: false
  end
  field :time_sheet, Types::TimeSheetType, null: false do
    argument :id, ID, required: true
  end
  field :time_sheet_summary, Types::TimeSheetSummaryType, null: false do
    argument :end_time, GraphQL::Types::ISO8601DateTime, required: false
    argument :restaurant_id, ID, required: true
    argument :start_time, GraphQL::Types::ISO8601DateTime, required: false
    argument :user_ids, [ID], required: false
  end
  field :time_sheets, Types::TimeSheetType.collection_type, null: false do
    argument :end_date, GraphQL::Types::ISO8601DateTime, required: false
    argument :page, Integer, required: true
    argument :per_page, Integer, required: true
    argument :restaurant_id, ID, required: true
    argument :start_date, GraphQL::Types::ISO8601DateTime, required: false
    argument :user_ids, [String], required: false
  end
  field :user, Types::UserType, null: false do
    argument :id, ID, required: true
  end
  field :users, [Types::UserType], null: false do
    argument :restaurant_id, ID, required: true
  end

  def addon(id:)
    AddonPolicy.new(context[:current_session]).scope.find(id)
  end

  def addons(restaurant_id:)
    AddonPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)
  end

  def booking(id:)
    BookingPolicy.new(context[:current_session]).scope.find(id)
  end

  def bookings(page:, per_page:, restaurant_id:, booking_types: [], end_date: nil, export: false, start_date: nil, status: nil, table_name: nil) # rubocop:disable Metrics/ParameterLists,Layout/LineLength,Metrics/AbcSize,Metrics/CyclomaticComplexity
    records = BookingPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)

    records = records.where(clocked_in_at: start_date..end_date) if start_date.present? && end_date.present?

    records = records.where(booking_type: booking_types) if booking_types.present?
    records = records.where(clocked_out_at: nil) if status == "current"
    records = records.where.not(clocked_out_at: nil) if status == "completed"
    records = records.joins(:booking_tables).where(booking_tables: { name: table_name }) if table_name.present?

    records = records.order(created_at: :desc)

    return export_collection(records) if export

    records.page(page).per(per_page)
  end

  def categories(restaurant_id:)
    records = CategoryPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)

    records.order(:name)
  end

  def category(id:)
    CategoryPolicy.new(context[:current_session]).scope.find(id)
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
    current_session = context[:current_session]

    return current_session.kds_admin! if current_session.kds_admin?
    return current_session.mobile_admin! if current_session.mobile_admin?
    return current_session.web_admin! if current_session.web_admin?

    raise GraphQL::ExecutionError, "Unauthorized"
  end

  def current_user
    current_session = context[:current_session]

    return current_session.mobile_user! if current_session.mobile_user?

    raise GraphQL::ExecutionError, "Unauthorized"
  end

  def customers(restaurant_id:, page:, per_page:, export: false, query: nil)
    records = CustomerPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)
    records = records.order(created_at: :desc)

    if query.present?
      records = records.where("name ILIKE :q OR phone_number ILIKE :q OR email ILIKE :q", q: "%#{query}%")
    end

    return export_collection(records) if export

    records.page(page).per(per_page)
  end

  def dashboard_summary(restaurant_id:, start_time:, end_time:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)

    bookings = BookingPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)
    bookings = bookings.where.not(clocked_out_at: nil)
    bookings = bookings.where(created_at: start_time..end_time) if start_time.present? && end_time.present?

    { bookings: bookings, restaurant: restaurant }
  end

  def device(id:)
    DevicePolicy.new(context[:current_session]).scope.find(id)
  end

  def devices(restaurant_id:)
    records = DevicePolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)

    records.order(:name)
  end

  def discount(id:)
    DiscountPolicy.new(context[:current_session]).scope.find(id)
  end

  def discounts(restaurant_id:, discount_on: nil, channel: nil, item_id: nil) # rubocop:disable Metrics/AbcSize
    restaurant = Restaurant.find(restaurant_id)

    records = Time.use_zone(restaurant.timezone) do
      DiscountPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)
    end

    records = records.where(discount_on: discount_on) if discount_on.present?
    records = records.where("channels && ARRAY[?]::varchar[]", ["all", channel]) if channel.present?

    if item_id.present?
      category_discounts = records.joins(category_discounts: { category: :items }).where(items: { id: item_id })
      item_discounts = records.joins(:item_discounts).where(item_discounts: { item_id: item_id })

      records = records.where(id: category_discounts.ids + item_discounts.ids)
    end

    records
  end

  def floor_objects(restaurant_id:)
    FloorObjectPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)
  end

  def inventory_categories(restaurant_id:)
    InventoryCategoryPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)
  end

  def inventory_category(id:)
    InventoryCategoryPolicy.new(context[:current_session]).scope.find(id)
  end

  def invoice(id:)
    InvoicePolicy.new(context[:current_session]).scope.find(id)
  end

  def invoices(restaurant_id:, page:, per_page:, booking_types: [], start_date: nil, end_date: nil, status: nil, export: false) # rubocop:disable Metrics/ParameterLists, Metrics/AbcSize, Layout/LineLength
    records = InvoicePolicy.new(context[:current_session]).scope
                           .joins(:booking).where(bookings: { restaurant_id: restaurant_id })

    records = records.where(bookings: { booking_type: booking_types }) if booking_types.present?
    records = records.completed if status == "completed"
    records = records.current if status == "current"

    if start_date.present? && end_date.present?
      records = records.joins(:booking).where(bookings: { clocked_in_at: start_date..end_date })
    end

    records = records.order(created_at: :desc)

    return export_collection(records) if export

    records.page(page).per(per_page)
  end

  def item(id:)
    ItemPolicy.new(context[:current_session]).scope.find(id)
  end

  def items(restaurant_id:, category_id: nil, query: nil)
    records = ItemPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)

    records = records.where(category_id: category_id) if category_id.present?
    records = records.search(query) if query.present?

    records.order(:display_name)
  end

  def kitchen_profile(id:)
    KitchenProfilePolicy.new(context[:current_session]).scope.find(id)
  end

  def kitchen_profiles(restaurant_id:)
    KitchenProfilePolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)
  end

  def menu(id:)
    MenuPolicy.new(context[:current_session]).scope.find(id)
  end

  def menus(restaurant_id:)
    records = MenuPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)

    records.order(:name)
  end

  def modifier(id:)
    ModifierPolicy.new(context[:current_session]).scope.find(id)
  end

  def modifiers(restaurant_id:, item_id: nil) # rubocop:disable Metrics/AbcSize
    records = ModifierPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)

    if item_id.present?
      item = ItemPolicy.new(context[:current_session]).scope.find(item_id)

      category_modifiers = records.joins(:category_modifiers)
                                  .where(category_modifiers: { category_id: item.category_id })
      item_modifiers = records.joins(:item_modifiers).where(item_modifiers: { item_id: item_id })
      global_modifiers = records.where(global_modifier: true)

      records = records.where(id: category_modifiers.ids + item_modifiers.ids + global_modifiers.ids)
    end

    records
  end

  def printer_configuration(id:)
    PrinterConfigurationPolicy.new(context[:current_session]).scope.find(id)
  end

  def printer_configurations(restaurant_id:, ticket_id: nil)
    records = PrinterConfigurationPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)

    records = records.eager_load(:ticket_items).where(ticket_items: { ticket_id: ticket_id }) if ticket_id.present?

    records
  end

  def product(id:)
    ProductPolicy.new(context[:current_session]).scope.find(id)
  end

  def products(restaurant_id:, page:, per_page:)
    records = ProductPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)

    records.order(created_at: :desc).page(page).per(per_page)
  end

  def provinces(alpha2:)
    Country[alpha2].subdivision_names_with_codes.map do |i|
      { name: i[0], code: i[1] }
    end
  end

  def reservations(restaurant_id:, start_time: nil, end_time: nil)
    records = ReservationPolicy.new(context[:current_session]).scope
    records = records.where(restaurant_id: restaurant_id)

    records = records.where(reservation_at: start_time..end_time) if start_time.present? && end_time.present?

    records.order(:created_at)
  end

  def restaurant(id:)
    RestaurantPolicy.new(context[:current_session]).scope.find(id)
  end

  def restaurants(status: nil)
    records = RestaurantPolicy.new(context[:current_session]).scope

    records = records.where(status: status) if status.present?

    records
  end

  def role(id:)
    RolePolicy.new(context[:current_session]).scope.find(id)
  end

  def roles(restaurant_id:)
    RolePolicy.new(context[:current_session]).scope.joins(:restaurant).where(restaurant: { id: restaurant_id })
  end

  def service_charge(id:)
    ServiceChargePolicy.new(context[:current_session]).scope.find(id)
  end

  def service_charges(restaurant_id:)
    ServiceChargePolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)
  end

  def taxes(restaurant_id:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)
    records = TaxPolicy.new(context[:current_session]).scope
    records = records.where(province: restaurant.province, country: restaurant.country)

    postal_code_records = records.where(postal_code: restaurant.postal_code)
    postal_code_records.exists? ? postal_code_records : records
  end

  def tickets(restaurant_id:, page:, per_page:, kitchen_profile_id: nil, booking_types: [], status: []) # rubocop:disable Metrics/AbcSize, Metrics/ParameterLists
    records = TicketPolicy.new(context[:current_session]).scope.joins(booking: :restaurant)
                          .where(restaurants: { id: restaurant_id })

    records = records.where(bookings: { booking_type: booking_types }) if booking_types.present?

    if kitchen_profile_id.present?
      profile = KitchenProfilePolicy.new(context[:current_session]).scope.find(kitchen_profile_id)
      records = records.joins(ticket_items: :item).where(items: { category_id: profile.categories })
    end

    records = records.eager_load(:ticket_items).where(ticket_items: { status: status }) if status.present?

    order_direction = status.include?("served") ? :desc : :asc
    records.order(created_at: order_direction).page(page).per(per_page)
  end

  def time_sheet(id:)
    TimeSheetPolicy.new(context[:current_session]).scope.find(id)
  end

  def time_sheet_summary(restaurant_id:, start_time: nil, end_time: nil, user_ids: [])
    records = TimeSheetPolicy.new(context[:current_session]).scope
    records = records.joins(:user).where(user: { restaurant_id: restaurant_id })

    records = records.where(user_id: user_ids) if user_ids.present?
    records = records.where(start_time: start_time..end_time) if start_time.present? && end_time.present?

    records
  end

  def time_sheets(restaurant_id:, page:, per_page:, start_date: nil, end_date: nil, user_ids: nil) # rubocop:disable Metrics/ParameterLists
    records = TimeSheetPolicy.new(context[:current_session]).scope
    records = records.joins(:user).where(user: { restaurant_id: restaurant_id })

    records = records.where(user_id: user_ids) if user_ids.present?
    records = records.where(start_time: start_date..end_date) if start_date.present? && end_date.present?

    records.order(created_at: :desc).page(page).per(per_page)
  end

  def user(id:)
    UserPolicy.new(context[:current_session]).scope.find(id)
  end

  def users(restaurant_id:)
    UserPolicy.new(context[:current_session]).scope.where(restaurant_id: restaurant_id)
  end

  private

  def export_collection(records)
    paginated = Kaminari.paginate_array(records)

    paginated.page(1).per(paginated.total_count, max_per_page: paginated.total_count)
  end
end
