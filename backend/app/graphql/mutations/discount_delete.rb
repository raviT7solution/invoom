# frozen_string_literal: true

class Mutations::DiscountDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    discount = DiscountPolicy.new(context[:current_user]).scope.find(id)

    raise_error discount.errors.full_messages.to_sentence unless discount.destroy

    true
  end
end
