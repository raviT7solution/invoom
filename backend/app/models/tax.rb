# frozen_string_literal: true

class Tax < ApplicationRecord
  has_many :products, dependent: :restrict_with_error

  enum :category, [:meals, :non_alcoholic_beverages, :alcoholic_beverages, :uncategorized]
end
