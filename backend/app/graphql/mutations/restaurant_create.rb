# frozen_string_literal: true

class Mutations::RestaurantCreate < Mutations::BaseMutation
  argument :attributes, Types::RestaurantAttributes, required: true

  type Boolean, null: false

  def resolve(attributes:)
    admin = context[:current_user].web_admin!

    restaurant = Restaurant.new(admin_ids: [admin.id], **attributes)

    raise_error admin.errors.full_messages.to_sentence unless restaurant.save

    true
  end
end
