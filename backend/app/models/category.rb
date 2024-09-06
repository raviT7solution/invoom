# frozen_string_literal: true

class Category < ApplicationRecord
  belongs_to :restaurant
  belongs_to :tax, optional: true

  has_many :category_discounts, dependent: :destroy
  has_many :category_modifiers, dependent: :destroy
  has_many :items, dependent: :restrict_with_error
  has_many :kitchen_profile_categories, dependent: :restrict_with_error
  has_many :menu_categories, dependent: :destroy

  has_many :discounts, through: :category_discounts
  has_many :kitchen_profiles, through: :kitchen_profile_categories
  has_many :menus, through: :menu_categories
  has_many :modifiers, through: :category_modifiers

  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
end
