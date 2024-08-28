# frozen_string_literal: true

class Mutations::ProductTransactionCreate < Mutations::BaseMutation
  argument :attributes, Types::ProductTransactionAttributes, required: true
  argument :product_id, ID, required: true

  type Boolean, null: false

  def resolve(product_id:, attributes:)
    product_transaction = ProductTransaction.new(product_id: product_id, **attributes)

    raise_error product_transaction.errors.full_messages.to_sentence unless product_transaction.save

    true
  end
end
