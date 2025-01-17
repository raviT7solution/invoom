# frozen_string_literal: true

class Mutations::AddonsDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    addon = AddonPolicy.new(context[:current_session]).scope.find(id)

    raise_error addon.errors.full_messages.to_sentence unless addon.destroy

    true
  end
end
