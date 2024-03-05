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

ActiveRecord::Schema[7.0].define(version: 2024_02_29_105556) do
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

  create_table "categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.boolean "visible", default: true, null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "restaurant_id"], name: "index_categories_on_name_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_categories_on_restaurant_id"
  end

  create_table "category_modifiers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "category_id", null: false
    t.uuid "modifier_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_category_modifiers_on_category_id"
    t.index ["modifier_id"], name: "index_category_modifiers_on_modifier_id"
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

  create_table "item_addons", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "item_id", null: false
    t.uuid "addon_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["addon_id"], name: "index_item_addons_on_addon_id"
    t.index ["item_id", "addon_id"], name: "index_item_addons_on_item_id_and_addon_id", unique: true
    t.index ["item_id"], name: "index_item_addons_on_item_id"
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
    t.float "take_out_price", null: false
    t.float "delivery_price", null: false
    t.boolean "visible", default: true, null: false
    t.uuid "category_id", null: false
    t.uuid "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_items_on_category_id"
    t.index ["name", "restaurant_id"], name: "index_items_on_name_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_items_on_restaurant_id"
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

  create_table "restaurants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "roles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "restaurant_id", null: false
    t.string "name"
    t.string "permissions", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["restaurant_id", "name"], name: "index_roles_on_restaurant_id_and_name", unique: true
    t.index ["restaurant_id"], name: "index_roles_on_restaurant_id"
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
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["pin", "restaurant_id"], name: "index_users_on_pin_and_restaurant_id", unique: true
    t.index ["restaurant_id"], name: "index_users_on_restaurant_id"
  end

  add_foreign_key "addons", "restaurants"
  add_foreign_key "admin_restaurants", "admins"
  add_foreign_key "admin_restaurants", "restaurants"
  add_foreign_key "categories", "restaurants"
  add_foreign_key "category_modifiers", "categories"
  add_foreign_key "category_modifiers", "modifiers"
  add_foreign_key "floor_objects", "restaurants"
  add_foreign_key "item_addons", "addons"
  add_foreign_key "item_addons", "items"
  add_foreign_key "item_modifiers", "items"
  add_foreign_key "item_modifiers", "modifiers"
  add_foreign_key "items", "categories"
  add_foreign_key "items", "restaurants"
  add_foreign_key "menu_categories", "categories"
  add_foreign_key "menu_categories", "menus"
  add_foreign_key "menus", "restaurants"
  add_foreign_key "modifiers", "restaurants"
  add_foreign_key "roles", "restaurants"
  add_foreign_key "user_roles", "roles"
  add_foreign_key "user_roles", "users"
  add_foreign_key "users", "restaurants"
end
