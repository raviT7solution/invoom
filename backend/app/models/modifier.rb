# frozen_string_literal: true

class Modifier < ApplicationRecord
  belongs_to :restaurant

  has_many :category_modifiers, dependent: :destroy
  has_many :item_modifiers, dependent: :restrict_with_error

  has_many :categories, through: :category_modifiers
  has_many :items, through: :item_modifiers

  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
end
