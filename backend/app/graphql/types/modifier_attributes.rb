# frozen_string_literal: true

class Types::ModifierAttributes < Types::BaseInputObject
  argument :global_modifier, Boolean, required: false
  argument :multi_select, Boolean, required: false
  argument :name, String, required: false
  argument :values, [String], required: true
  argument :visible, Boolean, required: false

  argument :category_ids, [ID], required: false
end
