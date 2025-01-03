# frozen_string_literal: true

class Reservation < ApplicationRecord
  belongs_to :restaurant
  belongs_to :customer

  enum :status, [:pending, :completed, :confirmed, :wait_listed, :checked_in, :no_show, :cancelled], default: :pending

  validates :adults, presence: true, numericality: { greater_than: 0 }
  validates :kids, presence: true
  validates :reservation_at, presence: true
  validates :status, presence: true
end
