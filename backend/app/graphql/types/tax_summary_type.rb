# frozen_string_literal: true

class Types::TaxSummaryType < Types::BaseObject
  field :name, String, null: true
  field :value, Float, null: false
end
