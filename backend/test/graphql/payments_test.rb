# frozen_string_literal: true

require "test_helper"

class PaymentsTest < ActionDispatch::IntegrationTest
  test "create cash payment" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders", "payments"])
    user = create(:user, restaurant: restaurant, roles: [role])
    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking_table = build(:booking_table, floor_object: table)
    booking = create(:booking,
                     booking_tables: [booking_table],
                     booking_type: "dine_in",
                     pax: 1,
                     restaurant: restaurant,
                     user: user)

    invoice = create(:invoice, booking: booking)

    authentic_query user, "mobile_user", payment_create_string, variables: {
      input: {
        attributes: {
          mode: "cash"
        },
        invoiceId: invoice.id
      }
    }

    assert_query_success

    assert_attributes invoice.reload,
                      payment_mode: "cash",
                      status: "paid"
  end

  test "invoice void payment create" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders", "payments"])
    user = create(:user, restaurant: restaurant, roles: [role])
    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking_table = build(:booking_table, floor_object: table)
    booking = create(:booking,
                     booking_tables: [booking_table],
                     booking_type: "dine_in",
                     pax: 1,
                     restaurant: restaurant,
                     user: user)

    invoice = create(:invoice, booking: booking)

    authentic_query user, "mobile_user", payment_create_string, variables: {
      input: {
        attributes: {
          mode: "void",
          voidType: "promotional"
        },
        invoiceId: invoice.id
      }
    }

    assert_query_success

    assert_attributes invoice.reload,
                      payment_mode: "void",
                      void_type: "promotional"
  end

  private

  def payment_create_string
    <<~GQL
      mutation paymentCreate($input: PaymentCreateInput!) {
        paymentCreate(input: $input)
      }
    GQL
  end
end
