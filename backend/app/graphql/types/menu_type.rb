# frozen_string_literal: true

class Types::MenuType < Types::BaseObject
  field :description, String, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :visible, Boolean, null: false

  field :categories, [Types::CategoryType], null: false

  def categories
    BatchLoader::GraphQL.for(object).batch do |objects, loader|
      scope = CategoryPolicy.new(context[:current_session]).scope.order(:name)

      ActiveRecord::Associations::Preloader.new(records: objects, associations: :categories, scope: scope).call

      objects.each { |i| loader.call(i, i.categories) }
    end
  end
end
