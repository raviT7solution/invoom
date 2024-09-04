# frozen_string_literal: true

class Types::CustomerType < Types::BaseObject
  field :avg_invoice_amount, Float, null: false
  field :email, String, null: true
  field :id, ID, null: false
  field :invoice_count, Integer, null: false
  field :name, String, null: false
  field :phone_number, String, null: false
  field :total_invoice_amount, Float, null: false

  def avg_invoice_amount # rubocop:disable Metrics/AbcSize
    BatchLoader::GraphQL.for(object.id).batch do |ids, loader|
      invoices = Invoice.arel_table

      average = CustomerPolicy.new(context[:current_user]).scope
                              .joins(bookings: :invoices).where(bookings: { customer_id: ids })
                              .group(:id).average(invoices[:total])

      ids.each { |i| loader.call(i, average[i] || 0) }
    end
  end

  def invoice_count # rubocop:disable Metrics/AbcSize
    BatchLoader::GraphQL.for(object.id).batch do |ids, loader|
      invoices = Invoice.arel_table

      counts = CustomerPolicy.new(context[:current_user]).scope
                             .joins(bookings: :invoices).where(bookings: { customer_id: ids })
                             .group(:id).count(invoices[:id])

      ids.each { |i| loader.call(i, counts[i] || 0) }
    end
  end

  def total_invoice_amount # rubocop:disable Metrics/AbcSize
    BatchLoader::GraphQL.for(object.id).batch do |ids, loader|
      invoices = Invoice.arel_table

      total = CustomerPolicy.new(context[:current_user]).scope
                            .joins(bookings: :invoices).where(bookings: { customer_id: ids })
                            .group(:id).sum(invoices[:total])

      ids.each { |i| loader.call(i, total[i] || 0) }
    end
  end
end
