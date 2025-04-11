# frozen_string_literal: true

class Types::ReceiptConfigurationAttributes < Types::BaseInputObject
  argument :show_customer_details, Boolean, required: false
  argument :show_discount, Boolean, required: false
  argument :show_platform_branding, Boolean, required: false
  argument :show_unit_price, Boolean, required: false
end
