# frozen_string_literal: true

class Types::ProductTransactionAttributes < Types::BaseInputObject
  argument :price, Float, required: false
  argument :quantity, Float, required: false
  argument :stock_type, String, required: false
end
