# frozen_string_literal: true

class KitchenProfilesChannel < ApplicationCable::Channel
  def subscribed
    session = Session.find_signed!(params["Authorization"])
    kitchen_profile = KitchenProfilePolicy.new(session).scope.find(params[:kitchen_profile_id])

    stream_for kitchen_profile
  end
end
