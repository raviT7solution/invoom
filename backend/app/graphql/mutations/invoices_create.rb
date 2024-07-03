# frozen_string_literal: true

class Mutations::InvoicesCreate < Mutations::BaseMutation
  argument :attributes, [Types::InvoiceAttributes], required: true
  argument :booking_id, ID, required: true

  type Boolean, null: false

  def resolve(attributes:, booking_id:) # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
    booking = BookingPolicy.new(context[:current_user]).scope.find(booking_id)

    invoices = InvoicePolicy.new(context[:current_user]).scope.where(booking_id: booking_id)

    ApplicationRecord.transaction do
      invoices.destroy_all if invoices.present?

      attributes.each do |invoice_attributes|
        inv_discount_type = booking.applied_discount.discount_type if booking.applied_discount.present?
        inv_discount = booking.applied_discount.value if booking.applied_discount.present?
        total = invoice_attributes[:total]
        inv_total = invoice_attributes[:inv_total]

        invoice = Invoice.new(
          booking: booking,
          total: inv_total,
          invoice_type: invoice_attributes[:invoice_type]
        )

        invoice_attributes[:invoice_items].each do |item_attributes|
          ticket_item = TicketItemPolicy.new(context[:current_user]).scope.find(item_attributes[:ticket_item_id])
          discounted_price = 0
          item_discount = 0
          new_price = 0

          price = ticket_item.price
          consume_bill = item_attributes[:consume_bill]
          qty = item_attributes[:quantity]

          discount_type = ticket_item.applied_discount.discount_type if ticket_item.applied_discount.present?
          discount = ticket_item.applied_discount.value if ticket_item.applied_discount.present?

          if discount_type == "percentage"
            new_price = price * (qty / consume_bill)
            discounted_price = new_price - (new_price * discount / 100)
            item_discount = new_price - discounted_price

          elsif discount_type == "flat"
            new_price = price * (qty / consume_bill)
            ration = new_price / price
            item_discount = ration * discount
            discounted_price = new_price - item_discount

          else
            item_discount = 0
            new_price = price * (qty / consume_bill)
            discounted_price = 0
          end

          # bill discount apply
          discounted_price = new_price if discounted_price.zero?

          if inv_discount_type == "percentage"
            discounted_price -= (discounted_price * (inv_discount / 100))
            item_discount = new_price - discounted_price
          elsif inv_discount_type == "flat"
            inv_ratio = inv_total / total
            inv_per_discount = inv_ratio * inv_discount
            new_inv_discount = inv_per_discount / inv_total
            discounted_price -= (discounted_price * new_inv_discount)
            item_discount = new_price - discounted_price
          end

          invoice.invoice_items.new(
            consume_bill: item_attributes[:consume_bill],
            discounted_price: discounted_price,
            item_discount: item_discount,
            ticket_item_price: ticket_item.price,
            price: new_price,
            quantity: item_attributes[:quantity],
            ticket_item: ticket_item
          )
        end

        raise_error invoice.errors.full_messages.to_sentence unless invoice.save
      end
    end

    true
  end
end
