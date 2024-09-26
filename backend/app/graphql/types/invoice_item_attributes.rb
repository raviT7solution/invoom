# frozen_string_literal: true

class Types::InvoiceItemAttributes < Types::BaseInputObject
  argument :consume_bill, Float, required: false
  argument :ticket_item_id, ID, required: false
end
