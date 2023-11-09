# frozen_string_literal: true

require "application_system_test_case"

class TeamsTest < ApplicationSystemTestCase
  test "create role and user" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    sign_in(admin)

    visit path_for(:frontend, "/teams")
    wait_for_pending_requests

    click_on "Add Role"

    within ".ant-drawer" do
      fill_in "Name", with: "Chef"
      fill_in_select with: "Dashboard"

      click_on "Submit"
    end

    click_on "Add User"

    within ".ant-drawer" do
      fill_in "First Name", with: "John"
      fill_in "Last Name", with: "Doe"
      fill_in "Email", with: "john.doe@example.com"
      fill_in "Username", with: "john.doe"
      within ".ant-form-item", text: "Gender" do
        fill_in_select with: "Male"
      end
      fill_in "Phone", with: "+1101"
      fill_in "Address Line", with: "837 Auer Divide"
      fill_in "City", with: "North Henry"
      fill_in "Postal Code", with: "15721"
      fill_in "Start Date", with: "2016-02-01"
      fill_in "Wage", with: 10.5
      fill_in "Password", with: "Password@123"
      fill_in "Pin", with: "1234"
      within ".ant-form-item", text: "Role" do
        fill_in_select with: "Chef"
      end

      click_on "Submit"
    end

    wait_for_pending_requests

    assert_selector ".ant-card", text: "Chef"
    assert_selector ".ant-card", text: "John Doe"

    john_doe = User.find_by!(username: "john.doe")

    assert_attributes john_doe, first_name: "John",
                                last_name: "Doe",
                                email: "john.doe@example.com",
                                username: "john.doe",
                                gender: "male",
                                phone_number: "+1101",
                                address: "837 Auer Divide",
                                city: "North Henry",
                                zip_code: "15721",
                                start_date: Date.parse("2016-02-01"),
                                wage: 10.5,
                                roles: [Role.find_by!(name: "Chef")]
  end

  test "update role" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    role = create(:role, restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/teams")
    wait_for_pending_requests

    find(".anticon-edit").click
    wait_for_pending_requests

    within ".ant-drawer" do
      fill_in "Name", with: "Chef"
      fill_in_select with: "Dashboard"

      click_on "Submit"
    end

    wait_for_pending_requests

    assert_attributes role.reload, name: "Chef", permissions: ["dashboard"]
  end

  test "update user" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    role = create(:role, restaurant: restaurant)

    user = create(:user, roles: [role], restaurants: [restaurant])

    sign_in(admin)

    visit path_for(:frontend, "/teams")
    wait_for_pending_requests

    within find(".ant-card", exact_text: user.full_name) do
      find(".anticon-edit").click
    end

    wait_for_pending_requests

    within ".ant-drawer" do
      fill_in "First Name", with: "John"
      fill_in "Last Name", with: "Doe"

      click_on "Submit"
    end

    wait_for_pending_requests

    assert_attributes user.reload, first_name: "John", last_name: "Doe"
  end
end
