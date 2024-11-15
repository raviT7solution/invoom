# frozen_string_literal: true

class Mutations::BookingServiceChargesUpdate < Mutations::BaseMutation
  argument :booking_id, ID, required: false
  argument :service_charge_ids, [ID], required: false

  type Boolean, null: false

  def resolve(booking_id:, service_charge_ids:) # rubocop:disable Metrics/AbcSize
    booking = BookingPolicy.new(context[:current_user]).scope.find(booking_id)

    ApplicationRecord.transaction do
      BookingServiceCharge.where(booking_id: booking.id).destroy_all

      ServiceChargePolicy.new(context[:current_user]).scope.find(service_charge_ids).each do |charge|
        booking_service_charge = booking.booking_service_charges.new(
          charge_type: charge.charge_type,
          cst: charge.tax.cst,
          gst: charge.tax.gst,
          hst: charge.tax.hst,
          name: charge.name,
          pst: charge.tax.pst,
          qst: charge.tax.qst,
          rst: charge.tax.rst,
          service_charge: charge,
          value: charge.value
        )

        raise_error booking_service_charge.errors.full_messages.to_sentence unless booking_service_charge.save
      end
    end

    true
  end
end
