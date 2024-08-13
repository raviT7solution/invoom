# frozen_string_literal: true

class InvoiceServiceCharge < ApplicationRecord
  belongs_to :invoice

  enum :charge_type, [:percentage, :flat]

  validates :charge_type, presence: true
  validates :cst, presence: true
  validates :gst, presence: true
  validates :hst, presence: true
  validates :name, presence: true
  validates :pst, presence: true
  validates :qst, presence: true
  validates :rst, presence: true
  validates :value, presence: true
end
