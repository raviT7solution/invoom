# frozen_string_literal: true

class Addon < ApplicationRecord
  belongs_to :restaurant

  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
end
