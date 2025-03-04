# frozen_string_literal: true

class Types::FloorObjectType < Types::BaseObject
  field :active_user_full_name, String, null: true
  field :data, Types::FloorObject::DataType, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :object_type, enum("FloorObjectType", FloorObject.object_types.keys), null: false

  field :clocked_in_booking, Types::BookingType, null: true

  def clocked_in_booking # rubocop:disable Metrics/AbcSize
    BatchLoader::GraphQL.for(object.name).batch do |names, loader|
      records = BookingPolicy.new(context[:current_session]).scope.where_table_names_in(names).clocked_in

      records = records.order(created_at: :desc).each_with_object({}) do |i, o|
        i.table_names.each { |name| o[name] = i }
      end

      names.each { |name| loader.call(name, records[name]) }
    end
  end
end
