# frozen_string_literal: true

class Types::InvoiceServiceChargeAttributes < Types::BaseInputObject
  argument :invoice_id, ID, required: false
  argument :service_charge_ids, [ID], required: false
end
