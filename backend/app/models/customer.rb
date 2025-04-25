# frozen_string_literal: true

class Customer < ApplicationRecord
  belongs_to :restaurant

  has_many :bookings, dependent: :restrict_with_error
  has_many :reservations, dependent: :restrict_with_error

  validates :country_code, presence: true
  validates :name, presence: true
  validates :phone_number, uniqueness: { scope: :restaurant_id }, presence: true

  def phone_number_in_e164
    "#{country_code}#{phone_number}"
  end
end
