# frozen_string_literal: true

require "test_helper"

class DashboardTest < ActionDispatch::IntegrationTest
  test "dashboard summary" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                               booking_tables: [build(:booking_table, floor_object: table)],
                               clocked_out_at: Time.current)

    invoice = create(:invoice, booking: booking, status: :paid)

    authentic_query user, "mobile_user", dashboard_summary, variables: {
      endTime: 10.minutes.after.iso8601,
      restaurantId: restaurant.id,
      startTime: 10.days.ago.iso8601
    }

    assert_query_success

    hourly_revenue = Array.new(24, 0.0)
    hourly_revenue[invoice.created_at.hour] = 100.0

    expected_summary = {
      "avgBookingRevenue" => 100.0,
      "avgInvoiceRevenue" => 100.0,
      "bookingCount" => 1,
      "cardRevenue" => 0.0,
      "cashRevenue" => 100.0,
      "deliveryRevenue" => 0.0,
      "dineInRevenue" => 100.0,
      "hourlyRevenue" => hourly_revenue,
      "invoiceCount" => 1,
      "paxCount" => 2,
      "takeoutRevenue" => 0.0,
      "totalRevenue" => 100.0,
      "voidRevenue" => 0.0
    }

    assert_equal expected_summary, response.parsed_body["data"]["dashboardSummary"]
  end

  private

  def dashboard_summary
    <<~GQL
      query dashboardSummary(
        $endTime: ISO8601DateTime!
        $restaurantId: ID!
        $startTime: ISO8601DateTime!
      ) {
        dashboardSummary(
          endTime: $endTime
          restaurantId: $restaurantId
          startTime: $startTime
        ) {
          avgBookingRevenue
          avgInvoiceRevenue
          bookingCount
          cardRevenue
          cashRevenue
          deliveryRevenue
          dineInRevenue
          hourlyRevenue
          invoiceCount
          paxCount
          takeoutRevenue
          totalRevenue
          voidRevenue
        }
      }
    GQL
  end
end
