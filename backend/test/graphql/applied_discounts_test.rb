# frozen_string_literal: true

require "test_helper"

class AppliedDiscountsTest < ActionDispatch::IntegrationTest
  test "applied discount" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders", "apply_discount"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    discount = create(:discount, restaurant: restaurant)

    customer = create(:customer, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "takeout", customer: customer)

    authentic_query user, "mobile_user", applied_discount_create, variables: {
      input: {
        discountId: discount.id,
        discountableId: booking.id,
        discountableType: "bill_wise"
      }
    }

    assert_query_success
  end

  test "delete applied discount" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["apply_discount"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    customer = create(:customer, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "takeout", customer: customer)

    applied_discount = create(:applied_discount, discountable: booking, restaurant: restaurant)

    authentic_query user, "mobile_user", applied_discount_delete, variables: {
      id: applied_discount.id
    }

    assert_query_success
  end

  private

  def applied_discount_create
    <<~GQL
      mutation appliedDiscountCreate($input: AppliedDiscountCreateInput!) {
        appliedDiscountCreate(input: $input)
      }
    GQL
  end

  def applied_discount_delete
    <<~GQL
      mutation appliedDiscountDelete($id: ID!) {
        appliedDiscountDelete(input: { id: $id })
      }
    GQL
  end
end
