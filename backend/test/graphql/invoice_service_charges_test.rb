# frozen_string_literal: true

require "test_helper"

class InvoiceServiceChargesTest < ActionDispatch::IntegrationTest
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

    invoice_service_charge_old = create(
      :invoice_service_charge,
      charge_type: "percentage",
      cst: 0,
      gst: 7,
      hst: 0,
      pst: 0,
      qst: 0,
      rst: 0,
      value: 20,
      service_charge: create(:service_charge, restaurant: restaurant, tax: create(:tax)),
      invoice: invoice1
    )

    assert_attributes invoice1.reload, total: 11.466

    authentic_query user, "mobile_user", invoice_service_charges_update, variables: {
      input: {
        attributes: [
          { invoiceId: invoice1.id, serviceChargeIds: [service_charge1.id] },
          { invoiceId: invoice2.id, serviceChargeIds: [service_charge2.id] }
        ]
      }
    }

    assert_query_success
    assert_not InvoiceServiceCharge.exists?(id: invoice_service_charge_old)
    assert_attributes InvoiceServiceCharge.find_by!(invoice_id: invoice1.id),
                      charge_type: service_charge1.charge_type,
                      cst: service_charge1.tax.cst,
                      gst: service_charge1.tax.gst,
                      hst: service_charge1.tax.hst,
                      invoice_id: invoice1.id,
                      name: service_charge1.name,
                      pst: service_charge1.tax.pst,
                      qst: service_charge1.tax.qst,
                      rst: service_charge1.tax.rst,
                      value: service_charge1.value
    assert_attributes InvoiceServiceCharge.find_by!(invoice_id: invoice2.id),
                      charge_type: service_charge2.charge_type,
                      cst: service_charge2.tax.cst,
                      gst: service_charge2.tax.gst,
                      hst: service_charge2.tax.hst,
                      invoice_id: invoice2.id,
                      name: service_charge2.name,
                      pst: service_charge2.tax.pst,
                      qst: service_charge2.tax.qst,
                      rst: service_charge2.tax.rst,
                      value: service_charge2.value

    assert_in_delta 12.365, invoice1.reload.total
    assert_in_delta 22.4154, invoice2.reload.total
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
      :invoice_service_charge,
      charge_type: "percentage",
      cst: 0,
      gst: 7,
      hst: 0,
      pst: 0,
      qst: 0,
      rst: 0,
      value: 20,
      service_charge: create(:service_charge, restaurant: restaurant, tax: create(:tax)),
      invoice: invoice
    )

    assert_attributes invoice.reload, total: 11.466

    authentic_query user, "mobile_user", invoice_service_charges_update, variables: { input: {
      attributes: [{ invoiceId: invoice.id, serviceChargeIds: [] }]
    } }

    assert_query_success
    assert_attributes invoice.reload,
                      invoice_service_charge_ids: [],
                      total: 9.54
  end

  private

  def invoice_service_charges_update
    <<~GQL
      mutation invoiceServiceChargesUpdate($input: InvoiceServiceChargesUpdateInput!) {
        invoiceServiceChargesUpdate(input: $input)
      }
    GQL
  end
end
