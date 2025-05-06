# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2025_04_10_073004) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addons", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.float "price", null: false
    t.float "takeout_price", null: false
    t.float "delivery_price", null: false
    t.boolean "visible", default: true, null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "eq_price", default: false, null: false
    t.index ["name", "restaurant_id"], name: "index_addons_on_name_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_addons_on_restaurant_id"
  end

  create_table "admin_restaurants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "admin_id", null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["admin_id", "restaurant_id"], name: "index_admin_restaurants_on_admin_id_and_restaurant_id", unique: true
    t.index ["admin_id"], name: "index_admin_restaurants_on_admin_id"
    t.index ["restaurant_id"], name: "index_admin_restaurants_on_restaurant_id"
  end

  create_table "admins", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admins_on_email", unique: true
  end

  create_table "applied_discounts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.integer "discount_type", null: false
    t.float "value", null: false
    t.string "discountable_type", null: false
    t.uuid "discountable_id", null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["discountable_type", "discountable_id"], name: "index_applied_discounts_on_discountable", unique: true
    t.index ["restaurant_id"], name: "index_applied_discounts_on_restaurant_id"
  end

  create_table "booking_service_charges", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.float "cst", null: false
    t.float "gst", null: false
    t.float "hst", null: false
    t.float "pst", null: false
    t.float "qst", null: false
    t.float "rst", null: false
    t.float "value", null: false
    t.integer "charge_type", null: false
    t.string "name", null: false
    t.uuid "booking_id", null: false
    t.uuid "service_charge_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["booking_id"], name: "index_booking_service_charges_on_booking_id"
    t.index ["service_charge_id"], name: "index_booking_service_charges_on_service_charge_id"
  end

  create_table "bookings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "clocked_in_at", null: false
    t.datetime "clocked_out_at"
    t.integer "pax"
    t.integer "booking_type", null: false
    t.uuid "customer_id"
    t.uuid "restaurant_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "estimated_duration"
    t.integer "token"
    t.bigserial "number", null: false
    t.string "table_names", array: true
    t.string "active_user_full_name"
    t.index ["customer_id"], name: "index_bookings_on_customer_id"
    t.index ["number"], name: "index_bookings_on_number", unique: true
    t.index ["restaurant_id"], name: "index_bookings_on_restaurant_id"
    t.index ["user_id"], name: "index_bookings_on_user_id"
  end

  create_table "categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.boolean "visible", default: true, null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "tax_id"
    t.index ["name", "restaurant_id"], name: "index_categories_on_name_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_categories_on_restaurant_id"
    t.index ["tax_id"], name: "index_categories_on_tax_id"
  end

  create_table "category_discounts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "category_id", null: false
    t.uuid "discount_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_category_discounts_on_category_id"
    t.index ["discount_id"], name: "index_category_discounts_on_discount_id"
  end

  create_table "category_modifiers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "category_id", null: false
    t.uuid "modifier_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_category_modifiers_on_category_id"
    t.index ["modifier_id"], name: "index_category_modifiers_on_modifier_id"
  end

  create_table "customers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "email"
    t.string "phone_number", null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["phone_number", "restaurant_id"], name: "index_customers_on_phone_number_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_customers_on_restaurant_id"
  end

  create_table "devices", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "fingerprint", null: false
    t.string "name", null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["fingerprint", "restaurant_id"], name: "index_devices_on_fingerprint_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_devices_on_restaurant_id"
  end

  create_table "discounts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "auto_apply", default: false, null: false
    t.boolean "clubbed", default: false, null: false
    t.boolean "visible", default: true, null: false
    t.date "black_out_dates", null: false, array: true
    t.datetime "end_date_time"
    t.datetime "start_date_time"
    t.float "capping", null: false
    t.float "threshold", null: false
    t.float "value", null: false
    t.integer "discount_on", null: false
    t.integer "discount_type", null: false
    t.string "channels", null: false, array: true
    t.string "name", null: false
    t.string "repeat", null: false, array: true
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["restaurant_id"], name: "index_discounts_on_restaurant_id"
  end

  create_table "floor_objects", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "restaurant_id", null: false
    t.string "name", null: false
    t.integer "object_type", null: false
    t.json "data", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "restaurant_id"], name: "index_floor_objects_on_name_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_floor_objects_on_restaurant_id"
  end

  create_table "inventory_categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "description", null: false
    t.boolean "visible", default: true, null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "restaurant_id"], name: "index_inventory_categories_on_name_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_inventory_categories_on_restaurant_id"
  end

  create_table "invoice_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.float "consume_bill", null: false
    t.float "price", null: false
    t.uuid "ticket_item_id", null: false
    t.uuid "invoice_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["invoice_id"], name: "index_invoice_items_on_invoice_id"
    t.index ["ticket_item_id"], name: "index_invoice_items_on_ticket_item_id"
  end

  create_table "invoices", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigserial "number", null: false
    t.integer "invoice_type", null: false
    t.uuid "booking_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "primary", default: false, null: false
    t.index ["booking_id"], name: "index_invoices_on_booking_id"
    t.index ["number"], name: "index_invoices_on_number", unique: true
  end

  create_table "item_addons", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "item_id", null: false
    t.uuid "addon_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["addon_id"], name: "index_item_addons_on_addon_id"
    t.index ["item_id", "addon_id"], name: "index_item_addons_on_item_id_and_addon_id", unique: true
    t.index ["item_id"], name: "index_item_addons_on_item_id"
  end

  create_table "item_discounts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "item_id", null: false
    t.uuid "discount_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["discount_id"], name: "index_item_discounts_on_discount_id"
    t.index ["item_id"], name: "index_item_discounts_on_item_id"
  end

  create_table "item_modifiers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "item_id", null: false
    t.uuid "modifier_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_item_modifiers_on_item_id"
    t.index ["modifier_id"], name: "index_item_modifiers_on_modifier_id"
  end

  create_table "items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "display_name", null: false
    t.string "description", null: false
    t.float "price", null: false
    t.float "cost_of_production", null: false
    t.float "takeout_price", null: false
    t.float "delivery_price", null: false
    t.boolean "visible", default: true, null: false
    t.uuid "category_id", null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "tax_id", null: false
    t.boolean "eq_price", default: false, null: false
    t.string "uom", null: false
    t.index ["category_id"], name: "index_items_on_category_id"
    t.index ["name", "restaurant_id"], name: "index_items_on_name_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_items_on_restaurant_id"
    t.index ["tax_id"], name: "index_items_on_tax_id"
  end

  create_table "kitchen_profile_categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "kitchen_profile_id", null: false
    t.uuid "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_kitchen_profile_categories_on_category_id"
    t.index ["kitchen_profile_id"], name: "index_kitchen_profile_categories_on_kitchen_profile_id"
  end

  create_table "kitchen_profiles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "notify", default: true, null: false
    t.integer "columns", null: false
    t.integer "rows", null: false
    t.string "name", null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "printer_configuration_id"
    t.index ["printer_configuration_id"], name: "index_kitchen_profiles_on_printer_configuration_id"
    t.index ["restaurant_id"], name: "index_kitchen_profiles_on_restaurant_id"
  end

  create_table "menu_categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "menu_id", null: false
    t.uuid "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_menu_categories_on_category_id"
    t.index ["menu_id", "category_id"], name: "index_menu_categories_on_menu_id_and_category_id", unique: true
    t.index ["menu_id"], name: "index_menu_categories_on_menu_id"
  end

  create_table "menus", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "description", null: false
    t.boolean "visible", default: true, null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "restaurant_id"], name: "index_menus_on_name_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_menus_on_restaurant_id"
  end

  create_table "modifiers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.boolean "visible", default: true, null: false
    t.boolean "global_modifier", default: true, null: false
    t.boolean "multi_select", default: true, null: false
    t.uuid "restaurant_id", null: false
    t.string "values", null: false, array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "restaurant_id"], name: "index_modifiers_on_name_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_modifiers_on_restaurant_id"
  end

  create_table "payments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.float "amount", null: false
    t.float "tip", null: false
    t.integer "payment_mode", null: false
    t.integer "void_type"
    t.string "brand"
    t.string "card_number"
    t.string "funding"
    t.string "issuer"
    t.string "payment_intent_id"
    t.uuid "invoice_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["invoice_id"], name: "index_payments_on_invoice_id"
  end

  create_table "printer_configurations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "ip_address", null: false
    t.string "name", null: false
    t.string "port", null: false
    t.boolean "visible", default: true, null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "restaurant_id"], name: "index_printer_configurations_on_name_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_printer_configurations_on_restaurant_id"
  end

  create_table "product_transactions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.float "price", null: false
    t.integer "stock_type", null: false
    t.float "quantity", null: false
    t.uuid "product_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_product_transactions_on_product_id"
  end

  create_table "products", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "visible", default: true, null: false
    t.float "price", null: false
    t.float "reorder_point", null: false
    t.float "stock_limit", null: false
    t.float "weight", null: false
    t.string "description"
    t.string "item_code", null: false
    t.string "name", null: false
    t.string "uom", null: false
    t.uuid "inventory_category_id", null: false
    t.uuid "restaurant_id", null: false
    t.uuid "tax_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "available_quantity", null: false
    t.index ["inventory_category_id"], name: "index_products_on_inventory_category_id"
    t.index ["item_code", "restaurant_id"], name: "index_products_on_item_code_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_products_on_restaurant_id"
    t.index ["tax_id"], name: "index_products_on_tax_id"
  end

  create_table "receipt_configurations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "show_customer_details", default: true, null: false
    t.boolean "show_discount", default: true, null: false
    t.boolean "show_platform_branding", default: true, null: false
    t.boolean "show_unit_price", default: true, null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["restaurant_id"], name: "index_receipt_configurations_on_restaurant_id", unique: true
  end

  create_table "reservations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "status", null: false
    t.integer "adults", null: false
    t.datetime "reservation_at", null: false
    t.uuid "customer_id", null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "kids", null: false
    t.string "note"
    t.string "table_name"
    t.index ["customer_id"], name: "index_reservations_on_customer_id"
    t.index ["restaurant_id"], name: "index_reservations_on_restaurant_id"
  end

  create_table "restaurants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "address"
    t.string "pin_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "operational_since", null: false
    t.string "postal_code", null: false
    t.string "city", null: false
    t.string "province", null: false
    t.string "country", null: false
    t.string "phone_number", null: false
    t.string "email", null: false
    t.time "business_start_time"
    t.time "business_end_time"
    t.time "break_start_time"
    t.time "break_end_time"
    t.string "restaurant_type", null: false
    t.string "timezone", null: false
    t.integer "status", null: false
    t.string "payment_publishable_key"
    t.string "payment_secret_key"
    t.string "taxpayer_id"
    t.string "website"
    t.integer "stripe_account_type"
    t.string "stripe_account_id"
    t.string "twilio_account_sid"
    t.string "twilio_auth_token"
    t.string "twilio_sms_phone_number"
  end

  create_table "roles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "restaurant_id", null: false
    t.string "name"
    t.string "permissions", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "auto_clock_in", default: true, null: false
    t.index ["restaurant_id", "name"], name: "index_roles_on_restaurant_id_and_name", unique: true
    t.index ["restaurant_id"], name: "index_roles_on_restaurant_id"
  end

  create_table "service_charges", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.integer "charge_type", null: false
    t.float "value", null: false
    t.boolean "visible", default: false, null: false
    t.uuid "restaurant_id", null: false
    t.uuid "tax_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["restaurant_id"], name: "index_service_charges_on_restaurant_id"
    t.index ["tax_id"], name: "index_service_charges_on_tax_id"
  end

  create_table "sessions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "sessionable_type", null: false
    t.uuid "sessionable_id", null: false
    t.string "subject", null: false
    t.uuid "device_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["device_id"], name: "index_sessions_on_device_id"
    t.index ["sessionable_type", "sessionable_id"], name: "index_sessions_on_sessionable"
  end

  create_table "taxes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "display_name", null: false
    t.string "province", null: false
    t.string "country", null: false
    t.integer "category", null: false
    t.float "gst", null: false
    t.float "hst", null: false
    t.float "qst", null: false
    t.float "rst", null: false
    t.float "pst", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "cst", null: false
    t.string "postal_code"
  end

  create_table "ticket_item_addons", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.float "price", null: false
    t.uuid "ticket_item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ticket_item_id"], name: "index_ticket_item_addons_on_ticket_item_id"
  end

  create_table "ticket_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "display_name", null: false
    t.float "price", null: false
    t.float "quantity", null: false
    t.integer "status", null: false
    t.string "modifiers", default: [], null: false, array: true
    t.string "name", null: false
    t.string "note"
    t.uuid "ticket_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "gst", null: false
    t.float "hst", null: false
    t.float "pst", null: false
    t.float "qst", null: false
    t.float "rst", null: false
    t.uuid "item_id", null: false
    t.float "cst", null: false
    t.string "uom", null: false
    t.index ["item_id"], name: "index_ticket_items_on_item_id"
    t.index ["ticket_id"], name: "index_ticket_items_on_ticket_id"
  end

  create_table "tickets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "booking_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["booking_id"], name: "index_tickets_on_booking_id"
  end

  create_table "time_sheets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.datetime "start_time", null: false
    t.datetime "end_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_time_sheets_on_user_id"
  end

  create_table "user_roles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "role_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["role_id"], name: "index_user_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_user_roles_on_user_id_and_role_id", unique: true
    t.index ["user_id"], name: "index_user_roles_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.date "end_date"
    t.date "start_date", null: false
    t.float "wage", null: false
    t.integer "gender", null: false
    t.string "address"
    t.string "city"
    t.string "email", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "password_digest"
    t.string "phone_number", null: false
    t.string "zip_code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "province"
    t.string "preferred_name", null: false
    t.integer "employment_type", null: false
    t.float "max_hour", null: false
    t.string "pin", null: false
    t.uuid "restaurant_id", null: false
    t.string "country"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["pin", "restaurant_id"], name: "index_users_on_pin_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_users_on_restaurant_id"
  end

  add_foreign_key "addons", "restaurants"
  add_foreign_key "admin_restaurants", "admins"
  add_foreign_key "admin_restaurants", "restaurants"
  add_foreign_key "applied_discounts", "restaurants"
  add_foreign_key "booking_service_charges", "bookings"
  add_foreign_key "booking_service_charges", "service_charges"
  add_foreign_key "bookings", "customers"
  add_foreign_key "bookings", "restaurants"
  add_foreign_key "bookings", "users"
  add_foreign_key "categories", "restaurants"
  add_foreign_key "categories", "taxes"
  add_foreign_key "category_discounts", "categories"
  add_foreign_key "category_discounts", "discounts"
  add_foreign_key "category_modifiers", "categories"
  add_foreign_key "category_modifiers", "modifiers"
  add_foreign_key "customers", "restaurants"
  add_foreign_key "devices", "restaurants"
  add_foreign_key "discounts", "restaurants"
  add_foreign_key "floor_objects", "restaurants"
  add_foreign_key "inventory_categories", "restaurants"
  add_foreign_key "invoice_items", "invoices"
  add_foreign_key "invoice_items", "ticket_items"
  add_foreign_key "invoices", "bookings"
  add_foreign_key "item_addons", "addons"
  add_foreign_key "item_addons", "items"
  add_foreign_key "item_discounts", "discounts"
  add_foreign_key "item_discounts", "items"
  add_foreign_key "item_modifiers", "items"
  add_foreign_key "item_modifiers", "modifiers"
  add_foreign_key "items", "categories"
  add_foreign_key "items", "restaurants"
  add_foreign_key "items", "taxes"
  add_foreign_key "kitchen_profile_categories", "categories"
  add_foreign_key "kitchen_profile_categories", "kitchen_profiles"
  add_foreign_key "kitchen_profiles", "printer_configurations"
  add_foreign_key "kitchen_profiles", "restaurants"
  add_foreign_key "menu_categories", "categories"
  add_foreign_key "menu_categories", "menus"
  add_foreign_key "menus", "restaurants"
  add_foreign_key "modifiers", "restaurants"
  add_foreign_key "payments", "invoices"
  add_foreign_key "printer_configurations", "restaurants"
  add_foreign_key "product_transactions", "products"
  add_foreign_key "products", "inventory_categories"
  add_foreign_key "products", "restaurants"
  add_foreign_key "products", "taxes"
  add_foreign_key "receipt_configurations", "restaurants"
  add_foreign_key "reservations", "customers"
  add_foreign_key "reservations", "restaurants"
  add_foreign_key "roles", "restaurants"
  add_foreign_key "service_charges", "restaurants"
  add_foreign_key "service_charges", "taxes"
  add_foreign_key "sessions", "devices"
  add_foreign_key "ticket_item_addons", "ticket_items"
  add_foreign_key "ticket_items", "items"
  add_foreign_key "ticket_items", "tickets"
  add_foreign_key "tickets", "bookings"
  add_foreign_key "time_sheets", "users"
  add_foreign_key "user_roles", "roles"
  add_foreign_key "user_roles", "users"
  add_foreign_key "users", "restaurants"

  create_view "invoice_item_summaries", sql_definition: <<-SQL
      WITH ticket_item_discounts AS (
           SELECT ii_1.id AS invoice_item_id,
                  CASE
                      WHEN (ad.discount_type = 0) THEN (ii_1.price * ((1)::double precision - (ad.value / (100.0)::double precision)))
                      WHEN (ad.discount_type = 1) THEN (ii_1.price - (ad.value * (ii_1.price / ti.price)))
                      ELSE ii_1.price
                  END AS ticket_item_discounted_amount
             FROM ((invoice_items ii_1
               JOIN ticket_items ti ON ((ti.id = ii_1.ticket_item_id)))
               LEFT JOIN applied_discounts ad ON ((((ad.discountable_type)::text = 'TicketItem'::text) AND (ad.discountable_id = ti.id))))
          ), booking_sub_totals AS (
           SELECT i.booking_id AS id,
              sum(tid.ticket_item_discounted_amount) AS booking_sub_total
             FROM ((invoices i
               JOIN invoice_items ii_1 ON ((ii_1.invoice_id = i.id)))
               JOIN ticket_item_discounts tid ON ((tid.invoice_item_id = ii_1.id)))
            GROUP BY i.booking_id
          ), booking_discounts AS (
           SELECT ii_1.id,
                  CASE
                      WHEN (ad.discount_type = 0) THEN (tid.ticket_item_discounted_amount * ((1)::double precision - (ad.value / (100.0)::double precision)))
                      WHEN (ad.discount_type = 1) THEN (tid.ticket_item_discounted_amount - (ad.value * (tid.ticket_item_discounted_amount / bst.booking_sub_total)))
                      ELSE tid.ticket_item_discounted_amount
                  END AS discounted_amount
             FROM ((((invoice_items ii_1
               JOIN ticket_item_discounts tid ON ((tid.invoice_item_id = ii_1.id)))
               JOIN invoices i ON ((i.id = ii_1.invoice_id)))
               JOIN booking_sub_totals bst ON ((bst.id = i.booking_id)))
               LEFT JOIN applied_discounts ad ON ((((ad.discountable_type)::text = 'Booking'::text) AND (ad.discountable_id = i.booking_id))))
          )
   SELECT ii.id AS invoice_item_id,
      bd.discounted_amount
     FROM (invoice_items ii
       JOIN booking_discounts bd ON ((bd.id = ii.id)));
  SQL
  create_view "invoice_summaries", sql_definition: <<-SQL
      WITH invoice_counts AS (
           SELECT i_1.booking_id,
              count(i_1.id) AS count
             FROM invoices i_1
            GROUP BY i_1.booking_id
          ), subtotals AS (
           SELECT i_1.id,
              sum(iis.discounted_amount) AS subtotal,
              sum(((iis.discounted_amount * (((((ti.gst + ti.hst) + ti.pst) + ti.rst) + ti.qst) + ti.cst)) / (100.0)::double precision)) AS subtotal_tax
             FROM (((invoices i_1
               JOIN invoice_items ii ON ((ii.invoice_id = i_1.id)))
               JOIN invoice_item_summaries iis ON ((iis.invoice_item_id = ii.id)))
               JOIN ticket_items ti ON ((ti.id = ii.ticket_item_id)))
            GROUP BY i_1.id
          ), total_service_charges AS (
           SELECT i_1.id,
              sum(
                  CASE
                      WHEN (bsc.charge_type = 0) THEN ((s_1.subtotal * bsc.value) / (100.0)::double precision)
                      WHEN (bsc.charge_type = 1) THEN (bsc.value / (ic.count)::double precision)
                      ELSE (0.0)::double precision
                  END) AS total_service_charge,
              sum((
                  CASE
                      WHEN (bsc.charge_type = 0) THEN ((s_1.subtotal * bsc.value) / (100.0)::double precision)
                      WHEN (bsc.charge_type = 1) THEN (bsc.value / (ic.count)::double precision)
                      ELSE (0.0)::double precision
                  END * ((((((bsc.gst + bsc.hst) + bsc.pst) + bsc.rst) + bsc.qst) + bsc.cst) / (100.0)::double precision))) AS total_service_charge_tax
             FROM (((invoices i_1
               JOIN booking_service_charges bsc ON ((bsc.booking_id = i_1.booking_id)))
               JOIN subtotals s_1 ON ((s_1.id = i_1.id)))
               JOIN invoice_counts ic ON ((ic.booking_id = i_1.booking_id)))
            GROUP BY i_1.id
          )
   SELECT i.id AS invoice_id,
      s.subtotal,
      s.subtotal_tax,
      COALESCE(sc.total_service_charge, (0.0)::double precision) AS total_service_charge,
      COALESCE(sc.total_service_charge_tax, (0.0)::double precision) AS total_service_charge_tax,
      (((s.subtotal + s.subtotal_tax) + COALESCE(sc.total_service_charge, (0.0)::double precision)) + COALESCE(sc.total_service_charge_tax, (0.0)::double precision)) AS total
     FROM ((invoices i
       JOIN subtotals s ON ((s.id = i.id)))
       LEFT JOIN total_service_charges sc ON ((sc.id = i.id)));
  SQL
end
