# frozen_string_literal: true

class Category < ApplicationRecord
  belongs_to :restaurant

  has_many :items, dependent: :restrict_with_error
  has_many :menu_category, dependent: :destroy

  has_many :menu, through: :menu_category

  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
end
