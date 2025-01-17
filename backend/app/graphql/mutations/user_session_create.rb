# frozen_string_literal: true

class Mutations::UserSessionCreate < Mutations::BaseMutation
  argument :attributes, Types::UserSessionAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Types::UserSessionType, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)

    case attributes[:login_type]
    when "pin"
      authenticate_with_pin(restaurant, attributes)
    when "password"
      authenticate_with_password(restaurant, attributes)
    else
      raise_error "Invalid login type"
    end
  end

  private

  def authenticate_with_password(restaurant, attributes)
    user = restaurant.users.find(attributes[:user_id])

    raise_error "Invalid password" unless user.authenticate(attributes[:password])

    session_response(user)
  end

  def authenticate_with_pin(restaurant, attributes)
    user = restaurant.users.find_by(pin: attributes[:pin])

    raise_error "Invalid pin" unless user

    session_response(user)
  end

  def session_response(user)
    {
      auto_clock_in: user.auto_clock_in?,
      clock_in_status: user.already_clocked_in? ? "already_clocked_in" : "already_clocked_out",
      permissions: user.permissions,
      token: user_token(user)
    }
  end

  def user_token(user)
    Session.token(user, "mobile_user_id")
  end
end
