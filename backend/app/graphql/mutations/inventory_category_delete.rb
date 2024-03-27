# frozen_string_literal: true

class Mutations::InventoryCategoryDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    inventory_category = InventoryCategoryPolicy.new(context[:current_user]).scope.find(id)

    raise_error inventory_category.errors.full_messages.to_sentence unless inventory_category.destroy

    true
  end
end
