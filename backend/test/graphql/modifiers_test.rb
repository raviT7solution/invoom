# frozen_string_literal: true

require "test_helper"

class ModifiersTest < ActionDispatch::IntegrationTest
  test "list" do
    restaurant = create(:restaurant)
    admin = create(:admin)
    admin.restaurants = [restaurant]

    category = create(:category, restaurant: restaurant)
    item = create(:item, category: category, restaurant: restaurant, tax: create(:tax))

    m1 = create(:modifier, restaurant: restaurant, item_ids: [item.id])
    m2 = create(:modifier, restaurant: restaurant, category_ids: [category.id])
    m3 = create(:modifier, restaurant: restaurant, global_modifier: true)

    authentic_query admin, "web_admin", modifiers_query, variables: {
      restaurantId: restaurant.id,
      itemId: item.id
    }

    assert_query_success

    assert_equal 3, response.parsed_body["data"]["modifiers"].size
    assert_equal [m1.id, m2.id, m3.id].sort, response.parsed_body["data"]["modifiers"].pluck("id").sort
  end

  private

  def modifiers_query
    <<~GQL
      query modifiers(
        $restaurantId: ID!
        $itemId: ID
      ) {
        modifiers(
          restaurantId: $restaurantId
          itemId: $itemId
        ) {
          id
        }
      }
    GQL
  end
end
