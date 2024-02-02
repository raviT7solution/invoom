# frozen_string_literal: true

class Item < ApplicationRecord
  belongs_to :category
  belongs_to :restaurant

  has_many :item_addons, dependent: :destroy

  has_many :addons, through: :item_addons

  validates :cost_of_production, presence: true
  validates :delivery_price, presence: true
  validates :description, presence: true, if: proc { description.nil? }
  validates :display_name, presence: true
  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
  validates :price, presence: true
  validates :take_out_price, presence: true
end
