# frozen_string_literal: true

class KitchenProfileCategory < ApplicationRecord
  belongs_to :category
  belongs_to :kitchen_profile
end
