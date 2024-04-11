# frozen_string_literal: true

class BookingTable < ApplicationRecord
  belongs_to :booking
  belongs_to :floor_object, optional: true

  validates :name, presence: true
end
