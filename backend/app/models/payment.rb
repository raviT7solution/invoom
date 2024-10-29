# frozen_string_literal: true

class Payment < ApplicationRecord
  belongs_to :invoice

  enum :payment_mode, [:cash, :card, :void, :uber_eats, :door_dash, :skip_the_dishes, :gift_card, :cheque]
  enum :void_type, [:promotional, :complementary, :staff, :wastage, :food_tasting, :not_prepared, :lost_table, :dine_and_dash, :service_issue, :food_issue, :custom_reason] # rubocop:disable Layout/LineLength

  validates :amount, presence: true
  validates :payment_mode, presence: true
  validates :tip, presence: true
  validates :void_type, absence: true, unless: :void?
  validates :void_type, presence: true, if: :void?
end
