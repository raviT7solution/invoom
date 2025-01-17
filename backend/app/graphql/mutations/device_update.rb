# frozen_string_literal: true

class Mutations::DeviceUpdate < Mutations::BaseMutation
  argument :attributes, Types::DeviceAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    device = DevicePolicy.new(context[:current_session]).scope.find(id)

    raise_error device.errors.full_messages.to_sentence unless device.update(**attributes)

    true
  end
end
