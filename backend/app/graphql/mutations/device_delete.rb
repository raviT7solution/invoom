# frozen_string_literal: true

class Mutations::DeviceDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    device = DevicePolicy.new(context[:current_session]).scope.find(id)

    raise_error device.errors.full_messages.to_sentence unless device.destroy

    true
  end
end
