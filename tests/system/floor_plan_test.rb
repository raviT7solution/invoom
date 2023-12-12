# frozen_string_literal: true

require "application_system_test_case"

class FloorPlanTest < ApplicationSystemTestCase
  test "floor object" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    sign_in(admin)

    visit path_for(:frontend, "/floor-plan")
    wait_for_pending_requests

    click_on "Unlock floor plan"

    click_on "Add object"
    find(".ant-list-item", text: "Oval table").click

    table = find(".target-selectable")
    table.click
    table.native.drag_by 100, 100

    table_name = find("input[type='text']")
    table_name.click # focus
    table_name.set "Table 1"
    table.click # loose focus

    click_on "Save"

    floor_object = restaurant.floor_objects.object_type_table.last
    data = floor_object.data

    assert_attributes floor_object, name: "Table 1", object_type: "table"
    assert_equal "Table 1", data["name"]
    assert_equal "table", data["type"]
    assert_instance_of Integer, data["width"]
    assert_instance_of Integer, data["length"]
    assert_instance_of String, data["transform"]
    assert_equal 8, data["addons"]["chairQuantity"]
    assert_equal "oval", data["addons"]["type"]
  end
end
