# frozen_string_literal: true

class Types::CategoryAttributes < Types::BaseInputObject
  argument :name, String, required: false
  argument :visible, Boolean, required: false

  argument :menu_ids, [ID], required: false
end
