# frozen_string_literal: true

class ItemDiscount < ApplicationRecord
  belongs_to :discount
  belongs_to :item
end
