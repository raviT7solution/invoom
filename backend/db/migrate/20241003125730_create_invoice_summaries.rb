# frozen_string_literal: true

class CreateInvoiceSummaries < ActiveRecord::Migration[7.0]
  def change
    create_view :invoice_summaries
  end
end
