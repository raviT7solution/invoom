# frozen_string_literal: true

class PrinterConfiguration < ApplicationRecord
  belongs_to :restaurant

  validates :ip_address, presence: true
  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
  validates :port, presence: true
  validates :visible, inclusion: [true, false]
end
