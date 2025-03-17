# frozen_string_literal: true

class Customer < ApplicationRecord
  belongs_to :restaurant

  has_many :bookings, dependent: :restrict_with_error
  has_many :reservations, dependent: :restrict_with_error

  validates :country_code, presence: true
  validates :email, uniqueness: { scope: :restaurant_id }, allow_nil: true
  validates :name, presence: true
  validates :phone_number, presence: true

  def phone_number_in_e164
    "#{country_code}#{phone_number}"
  end
end
