# frozen_string_literal: true

class Mutations::ServiceChargeDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    service_charge = ServiceChargePolicy.new(context[:current_session]).scope.find(id)

    raise_error service_charge.errors.full_messages.to_sentence unless service_charge.destroy

    true
  end
end
