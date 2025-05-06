# frozen_string_literal: true

class Types::UserAttributes < Types::BaseInputObject
  argument :address, String, required: false
  argument :city, String, required: false
  argument :country, String, required: false
  argument :email, String, required: false
  argument :employment_type, String, required: false
  argument :end_date, String, required: false
  argument :first_name, String, required: false
  argument :gender, String, required: false
  argument :last_name, String, required: false
  argument :max_hour, Float, required: false
  argument :password, String, required: false
  argument :phone_number, String, required: false
  argument :pin, String, required: false
  argument :preferred_name, String, required: false
  argument :province, String, required: false
  argument :start_date, String, required: false
  argument :wage, Float, required: false
  argument :zip_code, String, required: false

  argument :role_ids, [ID], required: false
end
