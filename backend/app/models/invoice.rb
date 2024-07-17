# frozen_string_literal: true

class Invoice < ApplicationRecord
  belongs_to :booking

  has_many :invoice_items, dependent: :destroy

  enum :invoice_type, [:simple, :split_equally, :custom_split]
  enum :payment_mode, [:cash, :card, :void]
  enum :status, [:paid, :unpaid], default: :unpaid
  enum :void_type, [:promotional, :complementary, :staff, :wastage, :food_tasting, :not_prepared, :lost_table, :dine_and_dash, :service_issue, :food_issue, :custom_reason] # rubocop:disable Layout/LineLength

  validates :invoice_type, presence: true
  validates :status, presence: true
  validates :tip, presence: true
  validates :total, presence: true
  validates :void_type, absence: true, if: -> { cash? || card? }
  validates :void_type, presence: true, if: :void?

  def completed?
    paid? || void?
  end
end
