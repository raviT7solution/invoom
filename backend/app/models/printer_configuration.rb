# frozen_string_literal: true

class PrinterConfiguration < ApplicationRecord
  belongs_to :restaurant

  has_many :kitchen_profiles, dependent: :restrict_with_error

  has_many :categories, through: :kitchen_profiles
  has_many :items, through: :categories
  has_many :ticket_items, through: :items

  validates :ip_address, presence: true
  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
  validates :port, presence: true
  validates :visible, inclusion: [true, false]
end
