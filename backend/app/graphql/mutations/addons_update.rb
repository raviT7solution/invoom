# frozen_string_literal: true

class Mutations::AddonsUpdate < Mutations::BaseMutation
  argument :attributes, Types::AddonsAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    addon = AddonPolicy.new(context[:current_user]).scope.find(id)

    raise_error addon.errors.full_messages.to_sentence unless addon.update(attributes.to_h)

    true
  end
end
