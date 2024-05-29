# frozen_string_literal: true

require "test_helper"

class PaymentsTest < ActionDispatch::IntegrationTest
  test "create cash payment" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders", "payments"])
    user = create(:user, restaurant: restaurant, roles: [role])
    table1 = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking_table1 = build(:booking_table, floor_object: table1)
    booking = create(:booking,
                     booking_tables: [booking_table1],
                     booking_type: "dine_in",
                     pax: 1,
                     restaurant: restaurant,
                     user: user)

    authentic_query user, "mobile_user", payment_create_string, variables: {
      input: {
        attributes: {
          mode: "cash"
        },
        bookingId: booking.id
      }
    }

    assert_query_success

    assert_not_nil booking.reload.clocked_out_at
    assert_nil table1.reload.booking_table
  end

  private

  def payment_create_string
    <<~GQL
      mutation paymentCreate($input: PaymentCreateInput!){
        paymentCreate(input: $input)
      }
    GQL
  end
end
