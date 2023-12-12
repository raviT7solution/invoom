# frozen_string_literal: true

class Mutations::FloorObjectUpdate < Mutations::BaseMutation
  argument :attributes, [Types::FloorObjectAttributes], required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:) # rubocop:disable Metrics/AbcSize
    restaurant = RestaurantPolicy.new(context[:current_user]).scope.find(restaurant_id)

    ActiveRecord::Base.transaction do
      restaurant.floor_objects.destroy_all

      attributes.each do |a|
        floor_object = restaurant.floor_objects.new(**a)

        unless floor_object.save
          raise_error "#{floor_object.object_type} #{floor_object.errors.full_messages.to_sentence}".humanize
        end
      end
    end

    true
  end
end
