# frozen_string_literal: true

require "test_helper"

class PaymentsTest < ActionDispatch::IntegrationTest
  test "create cash payment" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders", "payments"])
    user = create(:user, restaurant: restaurant, roles: [role])
    booking = create(:booking,
                     booking_type: "dine_in",
                     pax: 1,
                     restaurant: restaurant,
                     table_names: ["T1"],
                     user: user)

    invoice = create(:invoice, booking: booking)

    authentic_query mobile_user_token(user, device), payment_create_string, variables: {
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
    device = create(:device, restaurant: restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders", "payments"])
    user = create(:user, restaurant: restaurant, roles: [role])
    booking = create(:booking,
                     booking_type: "dine_in",
                     pax: 1,
                     restaurant: restaurant,
                     table_names: ["T1"],
                     user: user)

    invoice = create(:invoice, booking: booking)

    authentic_query mobile_user_token(user, device), payment_create_string, variables: {
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
    device = create(:device, restaurant: restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders", "payments"])
    user = create(:user, restaurant: restaurant, roles: [role])
    booking = create(:booking,
                     booking_type: "dine_in",
                     pax: 1,
                     restaurant: restaurant,
                     table_names: ["T1"],
                     user: user)

    invoice = create(:invoice, booking: booking)

    authentic_query mobile_user_token(user, device), payment_create_string, variables: {
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
    device = create(:device, restaurant: restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders", "payments"])
    user = create(:user, restaurant: restaurant, roles: [role])
    booking = create(:booking,
                     booking_type: "dine_in",
                     pax: 1,
                     restaurant: restaurant,
                     table_names: ["T1"],
                     user: user)

    invoice = create(:invoice, booking: booking)

    authentic_query mobile_user_token(user, device), payment_create_string, variables: {
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

  test "create cheque payment" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders", "payments"])
    user = create(:user, restaurant: restaurant, roles: [role])
    booking = create(:booking,
                     booking_type: "dine_in",
                     pax: 1,
                     restaurant: restaurant,
                     table_names: ["T1"],
                     user: user)

    invoice = create(:invoice, booking: booking)

    authentic_query mobile_user_token(user, device), payment_create_string, variables: {
      input: {
        attributes: {
          amount: 10,
          paymentMode: "cheque",
          tip: 10
        },
        invoiceId: invoice.id
      }
    }

    assert_query_success
    assert_attributes Payment.first!,
                      amount: 10,
                      payment_mode: "cheque",
                      tip: 10
  end

  test "create gift card payment" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders", "payments"])
    user = create(:user, restaurant: restaurant, roles: [role])
    booking = create(:booking,
                     booking_type: "dine_in",
                     pax: 1,
                     restaurant: restaurant,
                     table_names: ["T1"],
                     user: user)

    invoice = create(:invoice, booking: booking)

    authentic_query mobile_user_token(user, device), payment_create_string, variables: {
      input: {
        attributes: {
          amount: 10,
          paymentMode: "gift_card",
          tip: 10
        },
        invoiceId: invoice.id
      }
    }

    assert_query_success
    assert_attributes Payment.first!,
                      amount: 10,
                      payment_mode: "gift_card",
                      tip: 10
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
