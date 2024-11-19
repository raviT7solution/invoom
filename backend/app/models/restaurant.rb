# frozen_string_literal: true

class Restaurant < ApplicationRecord
  has_secure_password :pin, validations: false

  has_many :addons, dependent: :destroy
  has_many :admin_restaurants, dependent: :restrict_with_error
  has_many :applied_discounts, dependent: :destroy
  has_many :bookings, dependent: :destroy
  has_many :categories, dependent: :destroy
  has_many :customers, dependent: :destroy
  has_many :discounts, dependent: :destroy
  has_many :floor_objects, dependent: :destroy
  has_many :inventory_categories, dependent: :destroy
  has_many :items, dependent: :destroy
  has_many :kitchen_profiles, dependent: :destroy
  has_many :menus, dependent: :destroy
  has_many :modifiers, dependent: :destroy
  has_many :printer_configurations, dependent: :destroy
  has_many :products, dependent: :destroy
  has_many :reservations, dependent: :destroy
  has_many :roles, dependent: :destroy
  has_many :service_charges, dependent: :destroy
  has_many :users, dependent: :destroy

  has_many :admins, through: :admin_restaurants

  enum :status, [:pending, :active], default: :pending
  enum :stripe_account_type, [:connect, :own], prefix: true

  validates :city, presence: true
  validates :country, presence: true
  validates :email, presence: true
  validates :name, presence: true
  validates :operational_since, presence: true
  validates :payment_publishable_key, absence: true, if: :stripe_account_type_connect?
  validates :payment_publishable_key, presence: true, if: :stripe_account_type_own?
  validates :payment_secret_key, absence: true, if: :stripe_account_type_connect?
  validates :payment_secret_key, presence: true, if: :stripe_account_type_own?
  validates :phone_number, presence: true
  validates :postal_code, presence: true
  validates :province, presence: true
  validates :restaurant_type, presence: true
  validates :status, presence: true
  validates :stripe_account_id, absence: true, if: :stripe_account_type_own?
  validates :stripe_account_id, presence: true, if: :stripe_account_type_connect?
  validates :timezone, presence: true
end
