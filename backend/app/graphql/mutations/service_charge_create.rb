# frozen_string_literal: true

class Mutations::ServiceChargeCreate < Mutations::BaseMutation
  argument :attributes, Types::ServiceChargeAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_user]).scope.find(restaurant_id)
    service_charge = restaurant.service_charges.new(attributes.to_h)

    raise_error service_charge.errors.full_messages.to_sentence unless service_charge.save

    true
  end
end
