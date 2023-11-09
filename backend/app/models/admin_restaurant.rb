# frozen_string_literal: true

class AdminRestaurant < ApplicationRecord
  belongs_to :admin
  belongs_to :restaurant
end
