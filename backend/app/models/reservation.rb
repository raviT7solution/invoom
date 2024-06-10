# frozen_string_literal: true

class Reservation < ApplicationRecord
  belongs_to :restaurant
  belongs_to :customer

  enum :status, { pending: 0, completed: 1 }, default: :pending

  validates :pax, presence: true
  validates :reservation_at, presence: true
  validates :status, presence: true
end
