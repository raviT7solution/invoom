# frozen_string_literal: true

require "test_helper"

class InvoicesTest < ActionDispatch::IntegrationTest
  test "split_equally invoices create" do
    booking, ticket_item1, ticket_item2, device = setup_ticket_items

    authentic_query mobile_user_token(booking.user, device), invoices_create, variables: { input: {
      bookingId: booking.id,
      attributes: [
        {
          invoiceType: "split_equally",
          invoiceItems: [
            { consumeBill: 2, ticketItemId: ticket_item1.id },
            { consumeBill: 2, ticketItemId: ticket_item2.id }
          ]
        },
        {
          invoiceType: "split_equally",
          invoiceItems: [
            { consumeBill: 2, ticketItemId: ticket_item1.id },
            { consumeBill: 2, ticketItemId: ticket_item2.id }
          ]
        }
      ]
    } }

    assert_query_success

    first, second = Invoice.order(:number)
    first_items = first.invoice_items.order(:created_at)
    second_items = second.invoice_items.order(:created_at)

    assert_equal 2, Invoice.count
    assert_equal 2, first_items.count
    assert_equal 2, second_items.count

    assert_attributes first,
                      booking_id: booking.id,
                      invoice_type: "split_equally",
                      primary: true
    assert_attributes second,
                      booking_id: booking.id,
                      invoice_type: "split_equally",
                      primary: false

    assert_attributes first.invoice_summary,
                      total: 193.9
    assert_attributes second.invoice_summary,
                      total: 193.9

    assert_attributes first_items[0],
                      consume_bill: 2,
                      price: 20
    assert_attributes first_items[0].invoice_item_summary,
                      discounted_amount: 20
    assert_attributes first_items[1],
                      consume_bill: 2,
                      price: 150
    assert_attributes first_items[1].invoice_item_summary,
                      discounted_amount: 150

    assert_attributes second_items[0],
                      consume_bill: 2,
                      price: 20
    assert_attributes second_items[0].invoice_item_summary,
                      discounted_amount: 20
    assert_attributes second_items[1],
                      consume_bill: 2,
                      price: 150
    assert_attributes second_items[1].invoice_item_summary,
                      discounted_amount: 150
  end

  test "revert split" do
    booking, ticket_item1, ticket_item2, device = setup_ticket_items

    authentic_query mobile_user_token(booking.user, device), invoices_create, variables: { input: {
      bookingId: booking.id,
      attributes: [
        {
          invoiceType: "split_equally",
          invoiceItems: [
            { consumeBill: 2, ticketItemId: ticket_item1.id },
            { consumeBill: 2, ticketItemId: ticket_item2.id }
          ]
        },
        {
          invoiceType: "split_equally",
          invoiceItems: [
            { consumeBill: 2, ticketItemId: ticket_item1.id },
            { consumeBill: 2, ticketItemId: ticket_item2.id }
          ]
        }
      ]
    } }

    assert_query_success

    first, second = Invoice.order(:number)

    create(:payment, invoice: first, payment_mode: "cash", amount: first.invoice_summary.total)
    create(:payment, invoice: second, payment_mode: "cash", amount: second.invoice_summary.total)

    assert_equal 2, Invoice.count
    assert_equal 2, Payment.count

    authentic_query mobile_user_token(booking.user, device), invoices_create, variables: {
      input: {
        bookingId: booking.id,
        attributes: [
          {
            invoiceType: "simple",
            invoiceItems: [
              { consumeBill: 1, ticketItemId: ticket_item1.id },
              { consumeBill: 1, ticketItemId: ticket_item2.id }
            ]
          }
        ]
      }
    }

    assert_equal 1, Invoice.count

    invoice = Invoice.last!

    assert_equal 2, invoice.payments.count
    assert_attributes invoice,
                      invoice_type: "simple",
                      primary: true
    assert_attributes invoice.invoice_summary,
                      total: 387.8
  end

  test "apply discount" do
    booking, ticket_item1, ticket_item2, device = setup_ticket_items

    booking_discount = create(
      :applied_discount,
      discountable: booking, discount_type: "flat", value: 10, restaurant: booking.restaurant
    )
    create(
      :applied_discount,
      discountable: ticket_item1, discount_type: "flat", value: 50, restaurant: booking.restaurant
    )
    create(
      :applied_discount,
      discountable: ticket_item2, discount_type: "percentage", value: 25, restaurant: booking.restaurant
    )

    authentic_query mobile_user_token(booking.user, device), invoices_create, variables: { input: {
      bookingId: booking.id,
      attributes: [
        {
          invoiceType: "split_equally",
          invoiceItems: [
            { consumeBill: 2, ticketItemId: ticket_item1.id },
            { consumeBill: 2, ticketItemId: ticket_item2.id }
          ]
        },
        {
          invoiceType: "split_equally",
          invoiceItems: [
            { consumeBill: 2, ticketItemId: ticket_item1.id },
            { consumeBill: 2, ticketItemId: ticket_item2.id }
          ]
        }
      ]
    } }

    assert_query_success

    first, second = Invoice.order(:number)
    first_items = first.invoice_items.order(:created_at)
    second_items = second.invoice_items.order(:created_at)

    assert_equal 2, Invoice.count
    assert_equal 2, first_items.count
    assert_equal 2, second_items.count

    assert_attributes first,
                      booking_id: booking.id,
                      invoice_type: "split_equally",
                      primary: true
    assert_attributes second,
                      booking_id: booking.id,
                      invoice_type: "split_equally",
                      primary: false

    assert_attributes first.invoice_summary,
                      total: 91.37954545454545
    assert_attributes second.invoice_summary,
                      total: 91.37954545454545

    assert_attributes first_items[0],
                      consume_bill: 2,
                      price: 20
    assert_attributes first_items[0].invoice_item_summary,
                      discounted_amount: -28.18181818181818
    assert_attributes first_items[1],
                      consume_bill: 2,
                      price: 150
    assert_attributes first_items[1].invoice_item_summary,
                      discounted_amount: 105.68181818181819

    assert_attributes second_items[0],
                      consume_bill: 2,
                      price: 20
    assert_attributes second_items[0].invoice_item_summary,
                      discounted_amount: -28.18181818181818
    assert_attributes second_items[1],
                      consume_bill: 2,
                      price: 150
    assert_attributes second_items[1].invoice_item_summary,
                      discounted_amount: 105.68181818181819

    booking_discount.destroy!

    create(
      :applied_discount,
      discountable: booking, discount_type: "percentage", value: 10, restaurant: booking.restaurant
    )

    first, second = Invoice.order(:number)
    first_items = first.invoice_items.order(:created_at)
    second_items = second.invoice_items.order(:created_at)

    assert_equal 2, Invoice.count
    assert_equal 2, first_items.count
    assert_equal 2, second_items.count

    assert_attributes first,
                      booking_id: booking.id,
                      invoice_type: "split_equally",
                      primary: true
    assert_attributes second,
                      booking_id: booking.id,
                      invoice_type: "split_equally",
                      primary: false

    assert_attributes first.invoice_summary,
                      total: 87.5475
    assert_attributes second.invoice_summary,
                      total: 87.5475

    assert_attributes first_items[0],
                      consume_bill: 2,
                      price: 20
    assert_attributes first_items[0].invoice_item_summary,
                      discounted_amount: -27.0
    assert_attributes first_items[1],
                      consume_bill: 2,
                      price: 150
    assert_attributes first_items[1].invoice_item_summary,
                      discounted_amount: 101.25

    assert_attributes second_items[0],
                      consume_bill: 2,
                      price: 20
    assert_attributes second_items[0].invoice_item_summary,
                      discounted_amount: -27.0
    assert_attributes second_items[1],
                      consume_bill: 2,
                      price: 150
    assert_attributes second_items[1].invoice_item_summary,
                      discounted_amount: 101.25
  end

  test "create ticket item after invoices are generated" do
    booking, ticket_item1, ticket_item2, device = setup_ticket_items

    authentic_query mobile_user_token(booking.user, device), invoices_create, variables: { input: {
      bookingId: booking.id,
      attributes: [
        {
          invoiceType: "split_equally",
          invoiceItems: [
            { consumeBill: 2, ticketItemId: ticket_item1.id },
            { consumeBill: 2, ticketItemId: ticket_item2.id }
          ]
        },
        {
          invoiceType: "split_equally",
          invoiceItems: [
            { consumeBill: 2, ticketItemId: ticket_item1.id },
            { consumeBill: 2, ticketItemId: ticket_item2.id }
          ]
        }
      ]
    } }

    assert_query_success

    first, second = Invoice.order(:number)
    first_items = first.invoice_items.order(:created_at)
    second_items = second.invoice_items.order(:created_at)

    assert_equal 2, Invoice.count
    assert_equal 2, first_items.count
    assert_equal 2, second_items.count

    assert_attributes first.invoice_summary, total: 193.9
    assert_attributes second.invoice_summary, total: 193.9

    ticket_item2.dup.save!

    first, second = Invoice.order(:number)
    first_items = first.invoice_items.order(:created_at)
    second_items = second.invoice_items.order(:created_at)

    assert_equal 2, Invoice.count
    assert_equal 3, first_items.count
    assert_equal 3, second_items.count

    assert_attributes first.invoice_summary, total: 366.4
    assert_attributes second.invoice_summary, total: 366.4
  end

  private

  def setup_ticket_items # rubocop:disable Metrics/AbcSize
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    customer = create(:customer, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "takeout", customer: customer)

    category = create(:category, restaurant: restaurant)
    item1 = create(:item, restaurant: restaurant, category: category, tax: create(:tax))
    item2 = create(:item, restaurant: restaurant, category: category, tax: create(:tax))
    ticket = create(:ticket, booking: booking)

    ticket_item1 = create(:ticket_item, item: item1, name: item1.name, status: "queued", ticket: ticket,
                                        price: 20, quantity: 2,
                                        cst: 0, gst: 0, hst: 7, pst: 0, qst: 0, rst: 0)
    ticket_item2 = create(:ticket_item, item: item2, name: item2.name, status: "queued", ticket: ticket,
                                        price: 75, quantity: 4,
                                        cst: 0, gst: 15, hst: 0, pst: 0, qst: 0, rst: 0)

    [booking, ticket_item1, ticket_item2, device]
  end

  def invoices_create
    <<~GQL
      mutation invoicesCreate($input: InvoicesCreateInput!) {
        invoicesCreate(input: $input)
      }
    GQL
  end
end
