# frozen_string_literal: true

require "test_helper"

class DashboardTest < ActionDispatch::IntegrationTest
  test "dashboard summary" do
    restaurant = create(:restaurant)
    admin = create(:admin, restaurant_ids: [restaurant.id])
    user = create(:user, restaurant: restaurant)

    service_charge = create(:service_charge, restaurant: restaurant, tax: create(:tax))

    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2, table_names: ["T1"])

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))

    ticket = create(:ticket, booking: booking)
    ticket_item1, ticket_item2 = create_list(
      :ticket_item,
      2,
      cst: 0,
      gst: 0,
      hst: 0,
      item: item,
      pst: 6,
      qst: 0,
      rst: 0,
      status: "queued",
      ticket: ticket
    )

    invoice = create(:invoice, booking: booking)

    create(:invoice_item, ticket_item: ticket_item1, invoice: invoice, price: 9)
    create(:invoice_item, ticket_item: ticket_item2, invoice: invoice, price: 18)

    create(:booking_service_charge,
           charge_type: "flat",
           cst: 0,
           gst: 0,
           hst: 13,
           pst: 0,
           qst: 0,
           rst: 0,
           value: 5,
           service_charge: service_charge, booking: booking)
    create(:booking_service_charge,
           charge_type: "percentage",
           cst: 0,
           gst: 9,
           hst: 0,
           pst: 0,
           qst: 0,
           rst: 0,
           value: 17.0,
           service_charge: service_charge, booking: booking)

    create(:payment, invoice: invoice, payment_mode: "cash", amount: invoice.invoice_summary.total, tip: 1.0)

    booking.update!(clocked_out_at: Time.current)

    authentic_query web_admin_token(admin), dashboard_summary, variables: {
      endTime: nil,
      restaurantId: restaurant.id,
      startTime: nil
    }

    assert_query_success

    hourly_revenue = Array.new(24, 0.0)
    hourly_revenue[invoice.created_at.in_time_zone(restaurant.timezone).hour] = 39.2731

    expected_summary = {
      "avgBookingRevenue" => 36.59,
      "avgInvoiceRevenue" => 36.59,
      "avgPaxRevenue" => 18.295,
      "bookingCount" => 1,
      "cardRevenue" => 0.0,
      "cashRevenue" => 39.2731,
      "chequeRevenue" => 0.0,
      "deliveryRevenue" => 0.0,
      "dineInRevenue" => 39.2731,
      "doorDashRevenue" => 0.0,
      "giftCardRevenue" => 0.0,
      "hourlyRevenue" => hourly_revenue,
      "invoiceCount" => 1,
      "otherRevenue" => 0.0,
      "paxCount" => 2,
      "skipTheDishesRevenue" => 0.0,
      "takeoutRevenue" => 0.0,
      "totalDiscounts" => 0.0,
      "totalGrossSales" => 39.27310000000001,
      "totalNetSales" => 36.59,
      "totalServiceCharges" => 9.59,
      "totalTaxes" => 2.6831,
      "totalTips" => 1.0,
      "totalVoids" => 0.0,
      "uberEatsRevenue" => 0.0,
      "voidRevenue" => 0.0
    }

    assert_equal expected_summary, response.parsed_body["data"]["dashboardSummary"]
  end

  private

  def dashboard_summary
    <<~GQL
      query dashboardSummary(
        $endTime: ISO8601DateTime
        $restaurantId: ID!
        $startTime: ISO8601DateTime
      ) {
        dashboardSummary(
          endTime: $endTime
          restaurantId: $restaurantId
          startTime: $startTime
        ) {
          avgBookingRevenue
          avgInvoiceRevenue
          avgPaxRevenue
          bookingCount
          cardRevenue
          cashRevenue
          chequeRevenue
          deliveryRevenue
          dineInRevenue
          doorDashRevenue
          giftCardRevenue
          hourlyRevenue
          invoiceCount
          otherRevenue
          paxCount
          skipTheDishesRevenue
          takeoutRevenue
          totalDiscounts
          totalGrossSales
          totalNetSales
          totalServiceCharges
          totalTaxes
          totalTips
          totalVoids
          uberEatsRevenue
          voidRevenue
        }
      }
    GQL
  end
end
