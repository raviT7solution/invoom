# frozen_string_literal: true

class Mutations::AppliedDiscountCreate < Mutations::BaseMutation
  argument :discount_id, ID, required: true
  argument :discountable_id, ID, required: true
  argument :discountable_type, enum("AppliedDiscountDiscountableType", ["item_wise", "bill_wise"]), required: true

  type Boolean, null: false

  def resolve(discount_id:, discountable_id:, discountable_type:) # rubocop:disable Metrics/AbcSize
    discount = DiscountPolicy.new(context[:current_user]).scope.find(discount_id)

    discountable = if discountable_type == "item_wise"
                     TicketItemPolicy.new(context[:current_user]).scope.find(discountable_id)
                   else
                     BookingPolicy.new(context[:current_user]).scope.find(discountable_id)
                   end

    applied_discount = AppliedDiscount.new(
      discount_type: discount.discount_type,
      discountable: discountable,
      name: discount.name,
      restaurant_id: discount.restaurant_id,
      value: discount.value
    )

    raise_error applied_discount.errors.full_messages.to_sentence unless applied_discount.save

    true
  end
end
