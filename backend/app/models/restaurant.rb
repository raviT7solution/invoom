# frozen_string_literal: true

class Restaurant < ApplicationRecord
  has_many :addons, dependent: :destroy
  has_many :admin_restaurants, dependent: :restrict_with_error
  has_many :bookings, dependent: :destroy
  has_many :categories, dependent: :destroy
  has_many :customers, dependent: :destroy
  has_many :floor_objects, dependent: :destroy
  has_many :inventory_categories, dependent: :destroy
  has_many :items, dependent: :destroy
  has_many :kitchen_profiles, dependent: :destroy
  has_many :menus, dependent: :destroy
  has_many :modifiers, dependent: :destroy
  has_many :roles, dependent: :destroy
  has_many :users, dependent: :destroy

  has_many :admins, through: :admin_restaurants

  enum :status, [:pending, :active], default: :pending

  validates :city, presence: true
  validates :country, presence: true
  validates :email, presence: true
  validates :name, presence: true
  validates :operational_since, presence: true
  validates :phone_number, presence: true
  validates :postal_code, presence: true
  validates :province, presence: true
  validates :restaurant_type, presence: true
  validates :status, presence: true
  validates :timezone, presence: true
end
