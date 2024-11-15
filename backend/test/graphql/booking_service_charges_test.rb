# frozen_string_literal: true

require "test_helper"

class BookingServiceChargesTest < ActionDispatch::IntegrationTest
  test "update" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    customer = create(:customer, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "takeout", customer: customer)

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

    service_charge1 = create(
      :service_charge,
      charge_type: "flat",
      restaurant: restaurant,
      tax: create(:tax, cst: 0, gst: 0, hst: 13, pst: 0, qst: 0, rst: 0),
      value: 5
    )
    service_charge2 = create(
      :service_charge,
      charge_type: "percentage",
      restaurant: restaurant,
      tax: create(:tax, cst: 0, gst: 9, hst: 0, pst: 0, qst: 0, rst: 0),
      value: 17
    )

    invoice1 = create(:invoice, booking: booking)
    invoice2 = create(:invoice, booking: booking)

    create(:invoice_item, ticket_item: ticket_item1, invoice: invoice1, price: 9)
    create(:invoice_item, ticket_item: ticket_item2, invoice: invoice2, price: 18)

    create(
      :booking_service_charge,
      charge_type: "percentage",
      cst: 0,
      gst: 7,
      hst: 0,
      pst: 0,
      qst: 0,
      rst: 0,
      value: 20,
      service_charge: create(:service_charge, restaurant: restaurant, tax: create(:tax)),
      booking: booking
    )

    assert_attributes invoice1.reload.invoice_summary, total: 11.466

    authentic_query user, "mobile_user", booking_service_charges_update, variables: {
      input: {
        bookingId: booking.id,
        serviceChargeIds: [service_charge1.id, service_charge2.id]
      }
    }

    assert_query_success
    assert_equal 2, booking.booking_service_charges.ids.count
    assert_attributes BookingServiceCharge.find_by!(booking_id: booking.id),
                      booking_id: booking.id,
                      charge_type: service_charge1.charge_type,
                      cst: service_charge1.tax.cst,
                      gst: service_charge1.tax.gst,
                      hst: service_charge1.tax.hst,
                      name: service_charge1.name,
                      pst: service_charge1.tax.pst,
                      qst: service_charge1.tax.qst,
                      rst: service_charge1.tax.rst,
                      value: service_charge1.value

    assert_in_delta 14.0327, invoice1.reload.invoice_summary.total
    assert_in_delta 25.2404, invoice2.reload.invoice_summary.total
  end

  test "destroy" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    customer = create(:customer, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "takeout", customer: customer)

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))

    ticket_item = create(
      :ticket_item,
      cst: 0,
      gst: 0,
      hst: 0,
      item: item,
      pst: 6,
      qst: 0,
      rst: 0,
      status: "queued",
      ticket: create(:ticket, booking: booking)
    )

    invoice = create(:invoice, booking: booking)
    create(:invoice_item, ticket_item: ticket_item, invoice: invoice, price: 9)

    create(
      :booking_service_charge,
      charge_type: "percentage",
      cst: 0,
      gst: 7,
      hst: 0,
      pst: 0,
      qst: 0,
      rst: 0,
      value: 20,
      service_charge: create(:service_charge, restaurant: restaurant, tax: create(:tax)),
      booking: booking
    )

    assert_attributes invoice.reload.invoice_summary, total: 11.466

    authentic_query user, "mobile_user", booking_service_charges_update, variables: { input: {
      bookingId: booking.id, serviceChargeIds: []
    } }

    assert_query_success
    assert_attributes booking.reload,
                      booking_service_charge_ids: []
    assert_attributes invoice.reload.invoice_summary,
                      total: 9.54
  end

  private

  def booking_service_charges_update
    <<~GQL
      mutation bookingServiceChargesUpdate($input: BookingServiceChargesUpdateInput!) {
        bookingServiceChargesUpdate(input: $input)
      }
    GQL
  end
end
