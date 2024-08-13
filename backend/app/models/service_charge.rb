# frozen_string_literal: true

class ServiceCharge < ApplicationRecord
  belongs_to :restaurant
  belongs_to :tax

  enum :charge_type, [:percentage, :flat]

  validates :charge_type, presence: true
  validates :name, presence: true
  validates :value, presence: true
  validates :visible, inclusion: [true, false]
end
