# frozen_string_literal: true

class Addon < ApplicationRecord
  belongs_to :restaurant

  has_many :item_addons, dependent: :restrict_with_error

  has_many :items, through: :item_addons

  validates :eq_price, inclusion: [true, false]
  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
end
