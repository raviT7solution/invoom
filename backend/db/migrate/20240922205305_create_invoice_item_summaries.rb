# frozen_string_literal: true

class CreateInvoiceItemSummaries < ActiveRecord::Migration[7.0]
  def change
    create_view :invoice_item_summaries
  end
end
