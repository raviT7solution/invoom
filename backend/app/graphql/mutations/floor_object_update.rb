# frozen_string_literal: true

class Mutations::FloorObjectUpdate < Mutations::BaseMutation
  argument :attributes, [Types::FloorObjectAttributes], required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:) # rubocop:disable Metrics/AbcSize
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)

    ApplicationRecord.transaction do
      attributes_map = attributes.index_by { |a| a[:id] }

      existing_ids = restaurant.floor_objects.ids
      to_be_updated = existing_ids & attributes.pluck(:id)
      to_be_created = attributes.pluck(:id) - existing_ids
      to_be_deleted = existing_ids - attributes.pluck(:id)

      restaurant.floor_objects.where(id: to_be_deleted).each do |i|
        raise_error i.errors.full_messages.to_sentence unless i.destroy
      end

      restaurant.floor_objects.where(id: to_be_updated).each do |i|
        raise_error i.errors.full_messages.to_sentence unless i.update(**attributes_map[i.id])
      end

      to_be_created.each do |i|
        floor_object = restaurant.floor_objects.new(**attributes_map[i])

        unless floor_object.save
          raise_error "#{floor_object.object_type} #{floor_object.errors.full_messages.to_sentence}".humanize
        end
      end
    end

    true
  end
end
