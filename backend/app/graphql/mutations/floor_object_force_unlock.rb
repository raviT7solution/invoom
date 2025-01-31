# frozen_string_literal: true

class Mutations::FloorObjectForceUnlock < Mutations::BaseMutation
  argument :floor_object_id, ID, required: true

  type Boolean, null: false

  def resolve(floor_object_id:)
    floor_object = FloorObjectPolicy.new(context[:current_session]).scope.find(floor_object_id)

    floor_object.update!(active_user_full_name: nil)

    true
  end
end
