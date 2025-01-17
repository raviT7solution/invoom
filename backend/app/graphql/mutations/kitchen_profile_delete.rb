# frozen_string_literal: true

class Mutations::KitchenProfileDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    kitchen_profile = KitchenProfilePolicy.new(context[:current_session]).scope.find(id)

    raise_error kitchen_profile.errors.full_messages.to_sentence unless kitchen_profile.destroy

    true
  end
end
