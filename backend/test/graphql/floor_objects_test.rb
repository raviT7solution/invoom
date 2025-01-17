# frozen_string_literal: true

require "test_helper"

class FloorObjectsTest < ActionDispatch::IntegrationTest
  test "floor object update" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    existing_speaker = create(:floor_object, :speaker, object_type: "speaker", restaurant: restaurant)
    existing_table = create(:floor_object, :rectangular_table, restaurant: restaurant)

    assert_equal 2, FloorObject.count

    authentic_query web_admin_token(admin), floor_object_update, variables: {
      input: {
        restaurantId: restaurant.id,
        attributes: [
          {
            id: existing_speaker.id,
            name: "Speaker - 1"
          },
          {
            id: "random-id",
            name: "T1",
            objectType: "table",
            data: {
              addons: { type: "oval", chairQuantity: 2 },
              length: 1,
              rotate: 90,
              translateX: 40,
              translateY: 40,
              width: 1
            }
          }
        ]
      }
    }

    assert_query_success

    assert_equal 2, FloorObject.count
    assert_nil FloorObject.find_by(id: existing_table.id)
    assert FloorObject.find_by(name: "T1")

    assert_not_equal existing_speaker.attributes, FloorObject.find(existing_speaker.id).attributes
    assert_equal existing_speaker.data, FloorObject.find(existing_speaker.id).data
    assert_attributes FloorObject.find(existing_speaker.id), name: "Speaker - 1"
  end

  private

  def floor_object_update
    <<~GQL
      mutation floorObjectUpdate($input: FloorObjectUpdateInput!) {
        floorObjectUpdate(input: $input)
      }
    GQL
  end
end
