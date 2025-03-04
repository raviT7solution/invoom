# frozen_string_literal: true

class Mutations::BookingUsersUpdate < Mutations::BaseMutation
  argument :table_name, String, required: true
  argument :user_id, ID, required: true

  type Boolean, null: false

  def resolve(table_name:, user_id:)
    bookings = BookingPolicy.new(context[:current_session]).scope
                            .where_table_names_in(table_name)
                            .clocked_in

    ApplicationRecord.transaction do
      bookings.each do |i|
        raise_error i.errors.full_messages.to_sentence unless i.update(user_id: user_id)
      end
    end

    true
  end
end
