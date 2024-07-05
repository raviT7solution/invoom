# frozen_string_literal: true

class Mutations::PaymentCreate < Mutations::BaseMutation
  argument :attributes, Types::PaymentAttributes, required: true
  argument :invoice_id, ID, required: true

  type Boolean, null: false

  def resolve(attributes:, invoice_id:) # rubocop:disable Metrics/AbcSize
    invoice = InvoicePolicy.new(context[:current_user]).scope.find(invoice_id)

    if attributes[:mode] == "cash" || attributes[:mode] == "card"
      invoice.update!(payment_mode: attributes[:mode], status: "paid")
    elsif attributes[:mode] == "void"
      invoice.update!(payment_mode: "void", void_type: attributes[:void_type])
    else
      raise_error "Invalid payment mode"
    end

    true
  rescue ActiveRecord::ActiveRecordError => e
    raise_error e.record.errors.full_messages.to_sentence

    false
  end
end
