# frozen_string_literal: true

class Product < ApplicationRecord
  belongs_to :inventory_category
  belongs_to :restaurant
  belongs_to :tax

  validates :description, presence: true
  validates :item_code, presence: true, uniqueness: { scope: :restaurant_id }
  validates :name, presence: true
  validates :price, presence: true
  validates :reorder_point, presence: true
  validates :stock_limit, presence: true
  validates :uom, presence: true
  validates :visible, inclusion: [true, false]
  validates :weight, presence: true
end
