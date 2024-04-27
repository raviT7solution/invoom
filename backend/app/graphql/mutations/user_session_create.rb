# frozen_string_literal: true

class Mutations::UserSessionCreate < Mutations::BaseMutation
  argument :attributes, Types::UserSessionAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Types::UserSessionType, null: false

  def resolve(restaurant_id:, attributes:) # rubocop:disable Metrics/AbcSize
    restaurant = RestaurantPolicy.new(context[:current_user]).scope.find(restaurant_id)

    if attributes[:login_type] == "pin" && attributes[:pin].present?
      return authenticate_with_pin(restaurant, attributes)
    end

    if attributes[:login_type] == "password" && attributes[:user_id].present? && attributes[:password].present?
      return authenticate_with_password(restaurant, attributes)
    end

    raise_error "Invalid login type"
  end

  private

  def authenticate_with_password(restaurant, attributes)
    user = restaurant.users.find(attributes[:user_id])

    raise_error "Invalid password" unless user.authenticate(attributes[:password])

    if attributes[:clock_type] == "clock_out"
      update_clock_out(user)
    else
      create_clock_in(user)
    end
  end

  def authenticate_with_pin(restaurant, attributes)
    user = restaurant.users.find_by(pin: attributes[:pin])

    raise_error "Invalid pin" unless user

    if attributes[:clock_type] == "clock_out"
      update_clock_out(user)
    else
      create_clock_in(user)
    end
  end

  def create_clock_in(user)
    raise_error "Unauthorized" unless user.permission?("clock_in_clock_out")

    if user_already_clocked_in?(user)
      return { clock_in_status: "already_clocked_in", permissions: [], preferred_name: "", token: "" }
    end

    time_sheet = user.time_sheets.new(start_time: DateTime.current)
    raise_error time_sheet.errors.full_messages.to_sentence unless time_sheet.save

    { token: Session.token(user, "mobile_user_id"), permissions: user.permissions, preferred_name: user.preferred_name }
  end

  def update_clock_out(user)
    raise_error "Unauthorized" unless user.permission?("clock_in_clock_out")

    time_sheet = user.time_sheets.find_by(end_time: nil)

    return { clock_in_status: "already_clocked_out", permissions: [], preferred_name: "", token: "" } unless time_sheet

    raise_error time_sheet.errors.full_messages.to_sentence unless time_sheet.update(end_time: DateTime.current)

    { token: "", permissions: [], preferred_name: "" }
  end

  def user_already_clocked_in?(user)
    user.time_sheets.exists?(end_time: nil)
  end
end
