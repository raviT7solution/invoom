# frozen_string_literal: true

class Types::InvoiceType < Types::BaseObject
  field :amount_received, String, null: true
  field :brand, String, null: true
  field :card_number, String, null: true
  field :funding, String, null: true
  field :id, ID, null: false
  field :invoice_type, Types::Invoice::InvoiceTypeEnum, null: false
  field :issuer, String, null: true
  field :number, Integer, null: false
  field :payment_mode, Types::Invoice::PaymentModeEnum, null: true
  field :status, Types::Invoice::StatusEnum, null: false
  field :sub_total, Float, null: false
  field :tip, Float, null: false
  field :total, Float, null: false
  field :total_discount, Float, null: false

  field :booking, Types::BookingType, scope: "BookingPolicy", preload: :booking, null: false
  field :invoice_items, [Types::InvoiceItemType], scope: "InvoiceItemPolicy", preload: :invoice_items, null: false

  field :tax_summary, [Types::TaxSummaryType], null: false

  field :invoice_service_charges, [Types::InvoiceServiceChargeType], scope: "InvoiceServiceChargePolicy",
                                                                     preload: :invoice_service_charges, null: false

  def sub_total
    object.invoice_items.sum(:price)
  end

  def tax_summary # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity, GraphQL/ResolverMethodLength
    taxes = []

    object.invoice_items.each do |invoice_item|
      if invoice_item.ticket_item.hst != 0
        hst = invoice_item.discounted_price * (invoice_item.ticket_item.hst / 100.0)
        name = "HST #{invoice_item.ticket_item.hst.round(0)}%"
        tax_found = false

        taxes.each do |tax|
          next unless tax[:name] == name

          tax[:value] += hst
          tax_found = true
          break
        end

        taxes << { name: name, value: hst } unless tax_found
      end
      # GST
      if invoice_item.ticket_item.gst != 0
        gst = invoice_item.discounted_price * (invoice_item.ticket_item.gst / 100.0)
        name = "GST #{invoice_item.ticket_item.gst.round(0)}%"
        tax_found = false

        taxes.each do |tax|
          next unless tax[:name] == name

          tax[:value] += gst
          tax_found = true
          break
        end

        taxes << { name: name, value: gst } unless tax_found
      end
      # PST
      if invoice_item.ticket_item.pst != 0
        pst = invoice_item.discounted_price * (invoice_item.ticket_item.pst / 100.0)
        name = "PST #{invoice_item.ticket_item.pst.round(0)}%"
        tax_found = false

        taxes.each do |tax|
          next unless tax[:name] == name

          tax[:value] += pst
          tax_found = true
          break
        end

        taxes << { name: name, value: pst } unless tax_found
      end
      # RST
      if invoice_item.ticket_item.rst != 0
        rst = invoice_item.discounted_price * (invoice_item.ticket_item.rst / 100.0)
        name = "RST #{invoice_item.ticket_item.rst.round(0)}%"
        tax_found = false

        taxes.each do |tax|
          next unless tax[:name] == name

          tax[:value] += rst
          tax_found = true
          break
        end

        taxes << { name: name, value: rst } unless tax_found
      end
      # QST
      next unless invoice_item.ticket_item.qst != 0

      qst = invoice_item.discounted_price * (invoice_item.ticket_item.qst / 100.0)
      name = "QST #{invoice_item.ticket_item.qst.round(0)}%"
      tax_found = false

      taxes.each do |tax|
        next unless tax[:name] == name

        tax[:value] += qst
        tax_found = true
        break
      end

      taxes << { name: name, value: qst } unless tax_found
    end

    # service charge
    object.invoice_service_charges.each do |service_charge|
      inv_total = object.invoice_items.sum(:discounted_price)

      value = if service_charge.charge_type == "percentage"
                inv_total * (service_charge.value / 100)
              else
                service_charge.value
              end

      if service_charge.hst != 0
        hst = value * (service_charge.hst / 100.0)
        name = "HST #{service_charge.hst.round(0)}%"
        tax_found = false

        taxes.each do |tax|
          next unless tax[:name] == name

          tax[:value] += hst
          tax_found = true
          break
        end

        taxes << { name: name, value: hst } unless tax_found
      end
      # GST
      if service_charge.gst != 0
        gst = value * (service_charge.gst / 100.0)
        name = "GST #{service_charge.gst.round(0)}%"
        tax_found = false

        taxes.each do |tax|
          next unless tax[:name] == name

          tax[:value] += gst
          tax_found = true
          break
        end

        taxes << { name: name, value: gst } unless tax_found
      end
      # PST
      if service_charge.pst != 0
        pst = value * (service_charge.pst / 100.0)
        name = "PST #{service_charge.pst.round(0)}%"
        tax_found = false

        taxes.each do |tax|
          next unless tax[:name] == name

          tax[:value] += pst
          tax_found = true
          break
        end

        taxes << { name: name, value: pst } unless tax_found
      end
      # RST
      if service_charge.rst != 0
        rst = value * (service_charge.rst / 100.0)
        name = "RST #{service_charge.rst.round(0)}%"
        tax_found = false

        taxes.each do |tax|
          next unless tax[:name] == name

          tax[:value] += rst
          tax_found = true
          break
        end

        taxes << { name: name, value: rst } unless tax_found
      end
      # QST
      next unless service_charge.qst != 0

      qst = value * (service_charge.qst / 100.0)
      name = "QST #{service_charge.qst.round(0)}%"
      tax_found = false

      taxes.each do |tax|
        next unless tax[:name] == name

        tax[:value] += qst
        tax_found = true
        break
      end

      taxes << { name: name, value: qst } unless tax_found
    end

    taxes
  end

  def total_discount
    object.invoice_items.sum(:item_discount)
  end
end
