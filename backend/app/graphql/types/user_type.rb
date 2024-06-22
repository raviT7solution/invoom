# frozen_string_literal: true

class Types::UserType < Types::BaseObject
  field :address, String, null: true
  field :city, String, null: true
  field :country, String, null: true
  field :country_code, String, null: false
  field :email, String, null: false
  field :employment_type, String, null: false
  field :end_date, String, null: true
  field :first_name, String, null: false
  field :full_name, String, null: false
  field :gender, String, null: false
  field :id, ID, null: false
  field :last_name, String, null: false
  field :max_hour, Float, null: false
  field :over_time, Boolean, null: false
  field :phone_number, String, null: false
  field :preferred_name, String, null: false
  field :province, String, null: true
  field :start_date, GraphQL::Types::ISO8601Date, null: false
  field :wage, Float, null: false
  field :zip_code, String, null: true

  field :clocked_in_at, GraphQL::Types::ISO8601DateTime, preload: :last_time_sheet, null: true
  field :role_ids, [ID], scope: "RolePolicy", preload: :roles, null: false

  def clocked_in_at
    object.last_time_sheet&.start_time
  end

  def over_time
    Random.new.rand(2) == 1
  end
end
