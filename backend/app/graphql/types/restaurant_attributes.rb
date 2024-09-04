# frozen_string_literal: true

class Types::RestaurantAttributes < Types::BaseInputObject
  argument :address, String, required: false
  argument :break_end_time, String, required: false
  argument :break_start_time, String, required: false
  argument :business_end_time, String, required: false
  argument :business_start_time, String, required: false
  argument :city, String, required: false
  argument :country, String, required: false
  argument :email, String, required: false
  argument :name, String, required: false
  argument :operational_since, String, required: false
  argument :payment_publishable_key, String, required: false
  argument :payment_secret_key, String, required: false
  argument :phone_number, String, required: false
  argument :pin, String, required: false
  argument :postal_code, String, required: false
  argument :province, String, required: false
  argument :restaurant_type, String, required: false
  argument :taxpayer_id, String, required: false
  argument :timezone, String, required: false
  argument :website, String, required: false
end
