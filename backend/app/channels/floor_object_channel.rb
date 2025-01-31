# frozen_string_literal: true

class FloorObjectChannel < ApplicationCable::Channel
  def subscribed
    session = Session.find_signed!(params["Authorization"])
    floor_object = FloorObjectPolicy.new(session).scope.find(params["floor_object_id"])

    floor_object.update!(active_user_full_name: session.mobile_user!.full_name)

    stream_for floor_object
  end

  def unsubscribed
    floor_object = FloorObject.find(params["floor_object_id"])

    floor_object.update!(active_user_full_name: nil)
  end
end
