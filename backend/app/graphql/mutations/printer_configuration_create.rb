# frozen_string_literal: true

class Mutations::PrinterConfigurationCreate < Mutations::BaseMutation
  argument :attributes, Types::PrinterConfigurationAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)
    printer_config = restaurant.printer_configurations.new(attributes.to_h)

    raise_error printer_config.errors.full_messages.to_sentence unless printer_config.save

    true
  end
end
