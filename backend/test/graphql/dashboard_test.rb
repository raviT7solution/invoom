# frozen_string_literal: true

require "test_helper"

class DashboardTest < ActionDispatch::IntegrationTest
  test "dashboard summary" do
    restaurant = create(:restaurant)
    admin = create(:admin, restaurant_ids: [restaurant.id])
    user = create(:user, restaurant: restaurant)

    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                               booking_tables: [build(:booking_table)])

    invoice = create(:invoice, booking: booking, total: 100)
    create(:payment, invoice: invoice, payment_mode: "cash", amount: invoice.total)

    booking.update!(clocked_out_at: Time.current)

    authentic_query admin, "web_admin", dashboard_summary, variables: {
      endTime: 10.minutes.after.iso8601,
      restaurantId: restaurant.id,
      startTime: 10.days.ago.iso8601
    }

    assert_query_success

    hourly_revenue = Array.new(24, 0.0)
    hourly_revenue[invoice.created_at.in_time_zone(restaurant.timezone).hour] = 100.0

    expected_summary = {
      "avgBookingRevenue" => 100.0,
      "avgInvoiceRevenue" => 100.0,
      "bookingCount" => 1,
      "cardRevenue" => 0.0,
      "cashRevenue" => 100.0,
      "deliveryRevenue" => 0.0,
      "dineInRevenue" => 100.0,
      "doorDashRevenue" => 0.0,
      "hourlyRevenue" => hourly_revenue,
      "invoiceCount" => 1,
      "paxCount" => 2,
      "skipTheDishesRevenue" => 0.0,
      "takeoutRevenue" => 0.0,
      "totalRevenue" => 100.0,
      "uberEatsRevenue" => 0.0,
      "voidRevenue" => 0.0
    }

    assert_equal expected_summary, response.parsed_body["data"]["dashboardSummary"]
  end

  test "sales summary" do
    restaurant = create(:restaurant)
    admin = create(:admin)
    admin.restaurants = [restaurant]
    user = create(:user, restaurant: restaurant)

    customer = create(:customer, restaurant: restaurant)
    booking = create(:booking,
                     booking_type: "takeout",
                     customer: customer,
                     restaurant: restaurant,
                     user: user)

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

    service_charge1 = create(:service_charge, restaurant: restaurant, tax: create(:tax))
    service_charge2 = create(:service_charge, restaurant: restaurant, tax: create(:tax))

    invoice1 = create(:invoice, booking: booking)
    invoice2 = create(:invoice, booking: booking)

    create(:invoice_item, ticket_item: ticket_item1, invoice: invoice1, price: 9)
    create(:invoice_item, ticket_item: ticket_item2, invoice: invoice2, price: 18)

    create(:invoice_service_charge,
           charge_type: "flat",
           cst: 0,
           gst: 0,
           hst: 13,
           pst: 0,
           qst: 0,
           rst: 0,
           value: 5,
           service_charge: service_charge1, invoice: invoice1)
    create(:invoice_service_charge,
           charge_type: "percentage",
           cst: 0,
           gst: 9,
           hst: 0,
           pst: 0,
           qst: 0,
           rst: 0,
           value: 17.0,
           service_charge: service_charge2, invoice: invoice2)

    create(:payment, payment_mode: "cash", invoice: invoice1, amount: invoice1.total, tip: 1.0)
    create(:payment, payment_mode: "cash", invoice: invoice2, amount: invoice2.total, tip: 2.0)

    # TODO: Remove reload after virtual total field
    booking.reload.update!(clocked_out_at: Time.current)

    authentic_query admin, "web_admin", sales_summary_query, variables: {
      endTime: nil,
      restaurantId: restaurant.id,
      startTime: nil
    }

    assert_query_success

    service_charge1_tax = 2.5 * 13 / 100
    service_charge1_amount = 2.5

    service_charge2_tax = (18 * 17 / 100.0) * 9 / 100
    service_charge2_amount = 18 * 17 / 100.0

    total_revenue = (9.54 + service_charge1_tax + service_charge1_amount) + \
                    (19.08 + service_charge2_tax + service_charge2_amount)
    total_tax = (9 * 0.06) + \
                (18 * 0.06) + \
                service_charge1_tax + \
                service_charge2_tax

    expected_summary = {
      "avgBookingRevenue" => total_revenue,
      "avgInvoiceRevenue" => total_revenue / 2,
      "invoiceCount" => 2,
      "bookingCount" => 1,
      "paxCount" => 0,
      "totalTip" => 3.0,
      "totalRevenue" => total_revenue,
      "totalTax" => total_tax
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
          doorDashRevenue
          hourlyRevenue
          invoiceCount
          paxCount
          skipTheDishesRevenue
          takeoutRevenue
          totalRevenue
          uberEatsRevenue
          voidRevenue
        }
      }
    GQL
  end

  def sales_summary_query
    <<~GQL
      query salesSummary(
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
          bookingCount
          invoiceCount
          paxCount
          totalRevenue
          totalTax
          totalTip
        }
      }
    GQL
  end
end
