# frozen_string_literal: true

class UserRestaurant < ApplicationRecord
  belongs_to :restaurant
  belongs_to :user
end
