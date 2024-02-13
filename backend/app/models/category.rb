# frozen_string_literal: true

class Category < ApplicationRecord
  belongs_to :restaurant

  has_many :category_modifiers, dependent: :destroy
  has_many :items, dependent: :restrict_with_error
  has_many :menu_categories, dependent: :destroy

  has_many :menus, through: :menu_categories
  has_many :modifiers, through: :category_modifiers

  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
end
