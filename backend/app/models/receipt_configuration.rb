# frozen_string_literal: true

class ReceiptConfiguration < ApplicationRecord
  belongs_to :restaurant

  validates :show_customer_details, inclusion: { in: [true, false] }
  validates :show_discount, inclusion: { in: [true, false] }
  validates :show_platform_branding, inclusion: { in: [true, false] }
  validates :show_unit_price, inclusion: { in: [true, false] }
end
