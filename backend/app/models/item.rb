# frozen_string_literal: true

class Item < ApplicationRecord
  scope :search, ->(q) { where("items.display_name ILIKE ?", "%#{q}%") }

  belongs_to :category
  belongs_to :restaurant
  belongs_to :tax

  has_many :item_addons, dependent: :destroy
  has_many :item_discounts, dependent: :destroy
  has_many :item_modifiers, dependent: :destroy
  has_many :ticket_items, dependent: :restrict_with_error

  has_many :addons, through: :item_addons
  has_many :discounts, through: :item_discount
  has_many :modifiers, through: :item_modifiers

  validates :cost_of_production, presence: true
  validates :delivery_price, presence: true
  validates :description, presence: true, if: proc { description.nil? }
  validates :display_name, presence: true
  validates :eq_price, inclusion: [true, false]
  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
  validates :price, presence: true
  validates :takeout_price, presence: true
  validates :uom, presence: true
end
