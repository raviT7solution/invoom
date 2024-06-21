# frozen_string_literal: true

class Mutations::DiscountUpdate < Mutations::BaseMutation
  argument :attributes, Types::DiscountAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    discount = DiscountPolicy.new(context[:current_user]).scope.find(id)

    raise_error discount.errors.full_messages.to_sentence unless discount.update(attributes.to_h)

    true
  end
end
