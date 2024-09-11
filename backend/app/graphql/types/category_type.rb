# frozen_string_literal: true

class Types::CategoryType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: false
  field :tax_id, ID, null: true
  field :visible, Boolean, null: false

  field :menu_ids, [ID], scope: "MenuPolicy", preload: :menus, null: false

  field :items, [Types::ItemType], null: false

  def items
    BatchLoader::GraphQL.for(object).batch do |objects, loader|
      scope = ItemPolicy.new(context[:current_user]).scope.order(:display_name)

      ActiveRecord::Associations::Preloader.new(records: objects, associations: :items, scope: scope).call

      objects.each { |i| loader.call(i, i.items) }
    end
  end
end
