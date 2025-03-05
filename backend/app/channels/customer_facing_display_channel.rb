# frozen_string_literal: true

class CustomerFacingDisplayChannel < ApplicationCable::Channel
  def show_invoice(data)
    session = Session.find_signed!(params["Authorization"])
    device = DevicePolicy.new(session).scope.find(params["device_id"])

    broadcast_to device, data
  end

  def subscribed
    session = Session.find_signed!(params["Authorization"])
    device = DevicePolicy.new(session).scope.find(params["device_id"])

    stream_for device
  end
end
