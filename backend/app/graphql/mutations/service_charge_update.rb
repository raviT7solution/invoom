# frozen_string_literal: true

class Mutations::ServiceChargeUpdate < Mutations::BaseMutation
  argument :attributes, Types::ServiceChargeAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    service_charge = ServiceChargePolicy.new(context[:current_user]).scope.find(id)

    raise_error service_charge.errors.full_messages.to_sentence unless service_charge.update(attributes.to_h)

    true
  end
end
