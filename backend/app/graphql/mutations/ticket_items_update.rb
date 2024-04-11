# frozen_string_literal: true

class Mutations::TicketItemsUpdate < Mutations::BaseMutation
  argument :attributes, [Types::TicketItemAttributes], required: true

  type Boolean, null: false

  def resolve(attributes:)
    items = TicketItemPolicy.new(context[:current_user]).scope.find(attributes.map(&:id))

    ApplicationRecord.transaction do
      items.each.with_index do |item, i|
        raise_error item.errors.full_messages.to_sentence unless item.update(attributes[i].to_h)
      end
    end

    true
  end
end
