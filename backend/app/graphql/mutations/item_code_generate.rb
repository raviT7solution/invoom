# frozen_string_literal: true

class Mutations::ItemCodeGenerate < Mutations::BaseMutation
  argument :restaurant_id, ID, required: true

  type String, null: false

  def resolve(restaurant_id:)
    loop do
      code = SecureRandom.alphanumeric(6).upcase

      break code unless Product.exists?(item_code: code, restaurant_id: restaurant_id)
    end
  end
end
