# frozen_string_literal: true

class PrinterConfiguration < ApplicationRecord
  belongs_to :restaurant

  has_many :kitchen_profiles, dependent: :restrict_with_error

  validates :ip_address, presence: true
  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
  validates :port, presence: true
  validates :visible, inclusion: [true, false]
end
