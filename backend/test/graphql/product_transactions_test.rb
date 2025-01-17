# frozen_string_literal: true

require "test_helper"

class ProductTransactionsTest < ActionDispatch::IntegrationTest
  test "create receive" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["inventory"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    inventory_category = create(:inventory_category, restaurant: restaurant)
    product = create(:product,
                     available_quantity: 10,
                     inventory_category: inventory_category,
                     restaurant: restaurant,
                     tax: create(:tax))

    authentic_query mobile_user_token(user, device), product_transaction_create_string, variables: {
      input: {
        attributes: {
          price: 12,
          quantity: 7,
          stockType: "receive"
        },
        productId: product.id
      }
    }

    assert_query_success
    assert_attributes Product.last!, \
                      available_quantity: 17
    assert_attributes ProductTransaction.last!, \
                      price: 12,
                      product_id: product.id,
                      quantity: 7,
                      stock_type: "receive"
  end

  test "create day end" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["inventory"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    inventory_category = create(:inventory_category, restaurant: restaurant)
    product = create(:product,
                     available_quantity: 10,
                     inventory_category: inventory_category,
                     restaurant: restaurant,
                     tax: create(:tax))

    authentic_query mobile_user_token(user, device), product_transaction_create_string, variables: {
      input: {
        attributes: {
          price: 0,
          quantity: 7,
          stockType: "day_end"
        },
        productId: product.id
      }
    }

    assert_query_success
    assert_attributes Product.last!, \
                      available_quantity: 7
    assert_attributes ProductTransaction.last!, \
                      price: 0,
                      product_id: product.id,
                      quantity: -3,
                      stock_type: "day_end"
  end

  private

  def product_transaction_create_string
    <<~GQL
      mutation productTransactionCreate($input: ProductTransactionCreateInput!) {
        productTransactionCreate(input: $input)
      }
    GQL
  end
end
