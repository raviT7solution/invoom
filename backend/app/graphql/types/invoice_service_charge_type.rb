# frozen_string_literal: true

class Types::InvoiceServiceChargeType < Types::BaseObject
  field :charge_amount, Float, null: false
  field :charge_type, Types::ServiceCharge::ChargeTypeEnum, null: false
  field :cst, Float, null: false
  field :gst, Float, null: false
  field :hst, Float, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :pst, Float, null: false
  field :qst, Float, null: false
  field :rst, Float, null: false
  field :service_charge_id, ID, null: false
  field :value, Float, null: false

  def charge_amount # rubocop:disable Metrics/AbcSize
    inv_total = object.invoice.invoice_items.sum { |i| i.invoice_item_summary.discounted_amount }

    if object.charge_type == "percentage"
      inv_total * (object.value / 100)
    else
      inv_count = object.invoice.booking.invoices.count
      object.value / inv_count
    end
  end
end
