# frozen_string_literal: true

require "test_helper"

class DiscountsTest < ActionDispatch::IntegrationTest
  test "discounts_by_args" do
    restaurant = create(:restaurant, timezone: "America/Toronto")
    role = create(:role, permissions: ["apply_discount"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    category = create(:category, restaurant: restaurant)
    item = create(:item, category: category, restaurant: restaurant, tax: create(:tax))

    discount = create(:discount, restaurant: restaurant,
                                 channels: ["takeout"],
                                 discount_on: "item_wise",
                                 category_ids: [category.id],
                                 auto_apply: false,
                                 clubbed: false,
                                 repeat: ["Sun", "Tue", "Wed"],
                                 black_out_dates: ["2024-04-01", "2024-04-05"],
                                 visible: true)

    # Blackout
    travel_to "2024-04-01T05:00:00Z" do
      authentic_query user, "mobile_user", discounts_query, variables: {
        restaurantId: restaurant.id, channel: "takeout", discountOn: "item_wise", itemId: item.id
      }

      assert_query_success
      assert_empty response.parsed_body["data"]["discounts"]
    end

    # Blackout in only UTC
    travel_to "2024-04-01" do
      authentic_query user, "mobile_user", discounts_query, variables: {
        restaurantId: restaurant.id, channel: "takeout", discountOn: "item_wise", itemId: item.id
      }

      assert_query_success
      assert_equal [{ "id" => discount.id }], response.parsed_body["data"]["discounts"]
    end

    # Tue
    travel_to "2024-04-02T05:00:00Z" do
      authentic_query user, "mobile_user", discounts_query, variables: {
        restaurantId: restaurant.id, channel: "takeout", discountOn: "item_wise", itemId: item.id
      }

      assert_query_success
      assert_equal [{ "id" => discount.id }], response.parsed_body["data"]["discounts"]
    end

    # Tue dine_ine
    travel_to "2024-04-02T05:00:00Z" do
      authentic_query user, "mobile_user", discounts_query, variables: {
        restaurantId: restaurant.id, channel: "dine_in", discountOn: "item_wise", itemId: item.id
      }

      assert_query_success
      assert_empty response.parsed_body["data"]["discounts"]
    end

    # Tue booking_wise
    travel_to "2024-04-02T05:00:00Z" do
      authentic_query user, "mobile_user", discounts_query, variables: {
        restaurantId: restaurant.id, channel: "dine_in", discountOn: "bill_wise"
      }

      assert_query_success
      assert_empty response.parsed_body["data"]["discounts"]
    end
  end

  private

  def discounts_query
    <<~GQL
      query discounts(
        $restaurantId: ID!
        $channel: DiscountChannelEnum
        $discountOn: DiscountOnEnum
        $itemId: ID
      ) {
        discounts(
          restaurantId: $restaurantId
          channel: $channel
          discountOn: $discountOn
          itemId: $itemId
        ) {
          id
        }
      }
    GQL
  end
end
