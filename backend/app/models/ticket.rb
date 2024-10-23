# frozen_string_literal: true

class Ticket < ApplicationRecord
  belongs_to :booking

  has_many :ticket_items, dependent: :destroy

  after_create_commit :broadcast

  private

  def broadcast
    ticket_items.includes(item: { category: :kitchen_profiles })
                .flat_map { |i| i.item.category.kitchen_profiles }.uniq.each do |i|
      KitchenProfilesChannel.broadcast_to(i, { event: "ticket_create" })
    end
  end
end
