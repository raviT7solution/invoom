# frozen_string_literal: true

class Mutations::ProductUpdate < Mutations::BaseMutation
  argument :attributes, Types::ProductAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    product = ProductPolicy.new(context[:current_session]).scope.find(id)

    raise_error product.errors.full_messages.to_sentence unless product.update(attributes.to_h)

    true
  end
end
