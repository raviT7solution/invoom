# frozen_string_literal: true

class Mutations::InventoryCategoryUpdate < Mutations::BaseMutation
  argument :attributes, Types::InventoryCategoryAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    inventory_category = InventoryCategoryPolicy.new(context[:current_session]).scope.find(id)

    raise_error inventory_category.errors.full_messages.to_sentence unless inventory_category.update(attributes.to_h)

    true
  end
end
