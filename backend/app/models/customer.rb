# frozen_string_literal: true

class Customer < ApplicationRecord
  belongs_to :restaurant

  has_many :bookings, dependent: :restrict_with_error

  validates :name, presence: true
  validates :phone_number, presence: true
end
