# frozen_string_literal: true

class AppliedDiscount < ApplicationRecord
  belongs_to :discountable, polymorphic: true
  belongs_to :restaurant

  enum :discount_type, [:percentage, :flat, :bogo, :combo, :compoff, :coupons]

  validates :discount_type, presence: true
  validates :name, presence: true
  validates :value, presence: true
end
