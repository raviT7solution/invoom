# frozen_string_literal: true

class Types::TaxType < Types::BaseObject
  field :category, String, null: false
  field :country, String, null: false
  field :display_name, String, null: false
  field :gst, Float, null: false
  field :hst, Float, null: false
  field :id, ID, null: false
  field :province, String, null: false
  field :pst, Float, null: false
  field :qst, Float, null: false
  field :rst, Float, null: false
end
