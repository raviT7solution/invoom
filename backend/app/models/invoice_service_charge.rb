# frozen_string_literal: true

class InvoiceServiceCharge < ApplicationRecord
  belongs_to :invoice
  belongs_to :service_charge

  enum :charge_type, [:percentage, :flat]

  validates :charge_type, presence: true
  validates :cst, presence: true
  validates :gst, presence: true
  validates :hst, presence: true
  validates :name, presence: true
  validates :pst, presence: true
  validates :qst, presence: true
  validates :rst, presence: true
  validates :value, presence: true

  after_create :update_inv_cal
  before_destroy :set_destroy_flag, :update_inv_cal

  private

  def set_destroy_flag
    @is_destroy = true
  end

  def update_inv_cal # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
    inv_total = invoice.invoice_items.sum(:discounted_price)
    service_charge = 0

    value = if charge_type == "percentage"
              inv_total * (self.value / 100)
            else
              inv_count = invoice.booking.invoices.count
              self.value / inv_count
            end
    if gst != 0
      gst = value * (self.gst / 100)
      service_charge += gst
    end

    if hst != 0
      hst = value * (self.hst / 100)
      service_charge += hst
    end

    if pst != 0
      pst = value * (self.pst / 100)
      service_charge += pst
    end

    if rst != 0
      rst = value * (self.rst / 100)
      service_charge += rst
    end

    if qst != 0
      qst = value * (self.qst / 100)
      service_charge += qst
    end
    total_charge = value + service_charge
    invoice = self.invoice
    ApplicationRecord.transaction do
      if @is_destroy
        invoice.update!(total: (invoice.total - total_charge).round(2))
      else
        invoice.update!(total: (invoice.total + total_charge).round(2))
      end
    end
  end
end
