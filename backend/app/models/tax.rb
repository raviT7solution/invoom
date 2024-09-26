# frozen_string_literal: true

class Tax < ApplicationRecord
  has_many :categories, dependent: :restrict_with_error
  has_many :products, dependent: :restrict_with_error

  enum :category, [:meals, :non_alcoholic_beverages, :alcoholic_beverages, :uncategorized]

  def self.amount_with_tax(object, value)
    tax_percentage = [:gst, :hst, :pst, :rst, :qst, :cst].sum { |i| object.public_send(i) }

    value + (value * tax_percentage / 100)
  end
end
