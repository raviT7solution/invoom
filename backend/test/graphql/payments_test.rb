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
          amount: 10,
          paymentMode: "cash",
          tip: 10
        },
        invoiceId: invoice.id
      }
    }

    assert_query_success
    assert_attributes Payment.first!,
                      amount: 10,
                      payment_mode: "cash",
                      tip: 10
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
          amount: 10,
          paymentMode: "void",
          voidType: "promotional"
        },
        invoiceId: invoice.id
      }
    }

    assert_query_success
    assert_attributes Payment.first!,
                      amount: 10,
                      payment_mode: "void",
                      void_type: "promotional"
  end

  test "create delivery partner payment" do
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
          amount: 10,
          paymentMode: "uber_eats"
        },
        invoiceId: invoice.id
      }
    }

    assert_query_success
    assert_attributes Payment.first!,
                      amount: 10,
                      payment_mode: "uber_eats"
  end

  test "create manual card payment" do
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
          amount: 10,
          paymentMode: "card"
        },
        invoiceId: invoice.id
      }
    }

    assert_query_success
    assert_attributes Payment.first!,
                      amount: 10,
                      payment_mode: "card"
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
