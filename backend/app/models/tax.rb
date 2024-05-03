# frozen_string_literal: true

class Tax < ApplicationRecord
  enum :category, [:meals, :non_alcoholic_beverages, :alcoholic_beverages]
end
