# frozen_string_literal: true

class InventoryCategory < ApplicationRecord
  belongs_to :restaurant

  has_many :products, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
  validates :description, presence: true, if: proc { description.nil? }
end
