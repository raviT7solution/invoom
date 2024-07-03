# frozen_string_literal: true

class Invoice < ApplicationRecord
  belongs_to :booking

  has_many :invoice_items, dependent: :destroy

  enum :invoice_type, [:simple, :split_equally, :custom_split]
  enum :payment_mode, [:cash, :card]
  enum :status, [:paid, :unpaid], default: :unpaid

  validates :invoice_type, presence: true
  validates :status, presence: true
  validates :total, presence: true
end
