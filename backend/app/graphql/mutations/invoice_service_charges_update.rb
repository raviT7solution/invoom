# frozen_string_literal: true

class Mutations::InvoiceServiceChargesUpdate < Mutations::BaseMutation
  argument :attributes, [Types::InvoiceServiceChargeAttributes], required: true

  type Boolean, null: false

  def resolve(attributes:) # rubocop:disable Metrics/AbcSize
    invoices = InvoicePolicy.new(context[:current_user]).scope.find(attributes.map(&:invoice_id))

    ApplicationRecord.transaction do
      invoices.each_with_index do |invoice, i|
        InvoiceServiceCharge.where(invoice_id: invoice.id).destroy_all

        ServiceChargePolicy.new(context[:current_user]).scope.find(attributes[i][:service_charge_ids]).each do |charge|
          invoice_service_charge = invoice.invoice_service_charges.new(
            charge_type: charge.charge_type,
            cst: charge.tax.cst,
            gst: charge.tax.gst,
            hst: charge.tax.hst,
            name: charge.name,
            pst: charge.tax.pst,
            qst: charge.tax.qst,
            rst: charge.tax.rst,
            service_charge: charge,
            value: charge.value
          )

          raise_error invoice_service_charge.errors.full_messages.to_sentence unless invoice_service_charge.save
        end
      end
    end

    true
  end
end
