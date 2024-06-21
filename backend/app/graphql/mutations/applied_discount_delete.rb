# frozen_string_literal: true

class Mutations::AppliedDiscountDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    applied_discount = AppliedDiscountPolicy.new(context[:current_user]).scope.find(id)

    raise_error applied_discount.errors.full_messages.to_sentence unless applied_discount.destroy

    true
  end
end
