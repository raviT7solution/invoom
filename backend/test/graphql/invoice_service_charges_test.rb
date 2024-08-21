# frozen_string_literal: true

require "test_helper"

class InvoiceServiceChargesTest < ActionDispatch::IntegrationTest
  test "update" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    customer = create(:customer, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "takeout", customer: customer)

    invoice1 = create(:invoice, booking: booking)
    invoice2 = create(:invoice, booking: booking)

    service_charge1 = create(:service_charge, restaurant: restaurant, tax: create(:tax))
    service_charge2 = create(:service_charge, restaurant: restaurant, tax: create(:tax))

    service_charge_old = create(:invoice_service_charge, invoice: invoice1, service_charge: service_charge1)

    authentic_query user, "mobile_user", invoice_service_charges_update, variables: {
      input: {
        attributes: [
          { invoiceId: invoice1.id, serviceChargeIds: [service_charge1.id] },
          { invoiceId: invoice2.id, serviceChargeIds: [service_charge2.id] }
        ]
      }
    }

    assert_query_success
    assert_not InvoiceServiceCharge.exists?(id: service_charge_old)
    assert_attributes InvoiceServiceCharge.find_by!(invoice_id: invoice1.id), \
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
    assert_attributes InvoiceServiceCharge.find_by!(invoice_id: invoice2.id), \
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
