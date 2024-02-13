# frozen_string_literal: true

class Modifier < ApplicationRecord
  belongs_to :restaurant

  has_many :category_modifiers, dependent: :destroy

  has_many :categories, through: :category_modifiers

  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
end
