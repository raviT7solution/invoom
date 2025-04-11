# frozen_string_literal: true

class Types::ReceiptConfigurationType < Types::BaseObject
  field :id, ID, null: false
  field :show_customer_details, Boolean, null: false
  field :show_discount, Boolean, null: false
  field :show_platform_branding, Boolean, null: false
  field :show_unit_price, Boolean, null: false
end
