# frozen_string_literal: true

class CategoryDiscount < ApplicationRecord
  belongs_to :category
  belongs_to :discount
end
