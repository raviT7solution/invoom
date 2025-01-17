# frozen_string_literal: true

class Mutations::KitchenProfileUpdate < Mutations::BaseMutation
  argument :attributes, Types::KitchenProfileAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    kitchen_profile = KitchenProfilePolicy.new(context[:current_session]).scope.find(id)

    raise_error kitchen_profile.errors.full_messages.to_sentence unless kitchen_profile.update(attributes.to_h)

    true
  end
end
