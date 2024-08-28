# frozen_string_literal: true

class ProductTransaction < ApplicationRecord
  belongs_to :product

  enum :stock_type, [:receive, :day_end]

  validates :price, numericality: { equal_to: 0 }, if: :day_end?
  validates :price, presence: true
  validates :quantity, presence: true
  validates :stock_type, presence: true

  before_create :update_available_quantity

  private

  def update_available_quantity
    self.quantity = quantity - product.available_quantity if day_end?

    available_quantity = product.available_quantity + quantity

    product.update!(available_quantity: available_quantity)
  end
end
