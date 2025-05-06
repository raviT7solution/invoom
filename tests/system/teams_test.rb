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

    click_on "Add role"

    within ".ant-drawer" do
      fill_in "Name", with: "Chef"
      fill_in_select with: "Clock in / Clock out"

      click_on "Submit"
    end

    click_on "Add user"

    within ".ant-drawer" do
      fill_in "First name", with: "John"
      fill_in "Last name", with: "Doe"
      fill_in "Email", with: "john.doe@example.com"
      fill_in "Preferred name", with: "john.doe"
      within ".ant-form-item", text: "Gender" do
        fill_in_select with: "Male"
      end
      within ".ant-form-item", text: "Employment type" do
        fill_in_select with: "Hourly"
      end
      within ".ant-form-item", text: "Phone number" do
        fill_in_select with: "+1"
      end
      fill_in "Phone number", with: "2015550123"
      within ".ant-form-item", text: "Country" do
        fill_in with: "Canada"
        fill_in_select with: "Canada"
      end
      within ".ant-form-item", text: "Province" do
        fill_in with: "Ontario"
        fill_in_select with: "Ontario"
      end
      within ".ant-form-item", text: "City" do
        fill_in with: "Brampton"
        fill_in_select with: "Brampton"
      end
      fill_in "Address line", with: "837 Auer Divide"
      fill_in "Postal code", with: "15721"
      within ".ant-form-item", text: "Start date" do
        fill_in_ant_picker with: "02-01-2016"
      end
      fill_in "Wage", with: 10.5
      fill_in "Weekly hour restriction", with: 11
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

    john_doe = User.find_by!(preferred_name: "john.doe")

    assert_attributes john_doe, address: "837 Auer Divide",
                                city: "Brampton",
                                country: "CA",
                                email: "john.doe@example.com",
                                employment_type: "hourly",
                                first_name: "John",
                                gender: "male",
                                last_name: "Doe",
                                max_hour: 11,
                                phone_number: "+12015550123",
                                pin: "1234",
                                preferred_name: "john.doe",
                                province: "ON",
                                restaurant_id: restaurant.id,
                                roles: [Role.find_by!(name: "Chef")],
                                start_date: Date.parse("2016-02-01"),
                                wage: 10.5,
                                zip_code: "15721"
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
      find(".ant-checkbox-wrapper", text: "Auto clock-in").click
      fill_in_select with: "Clock in / Clock out"

      click_on "Submit"
    end

    wait_for_pending_requests

    assert_attributes role.reload, auto_clock_in: false, name: "Chef", permissions: ["clock_in_clock_out"]
  end

  test "update user" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    role = create(:role, restaurant: restaurant)

    user = create(:user, roles: [role], restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/teams")
    wait_for_pending_requests

    within find(".ant-card", exact_text: user.full_name) do
      find(".anticon-edit").click
    end

    wait_for_pending_requests

    within ".ant-drawer" do
      fill_in "First name", with: "John"
      fill_in "Last name", with: "Doe"
      within ".ant-form-item", text: "Phone number" do
        within ".ant-select" do
          fill_in with: "+1"
          fill_in_select with: "+1"
        end
      end
      fill_in "Phone number", with: "2015550123"
      within ".ant-form-item", text: "Country" do
        fill_in with: "India"
        fill_in_select with: "India"
      end
      within ".ant-form-item", text: "Province" do
        fill_in with: "Gujarat"
        fill_in_select with: "Gujarat"
      end
      within ".ant-form-item", text: "City" do
        fill_in with: "Ahmedabad"
        fill_in_select with: "Ahmedabad"
      end
      fill_in "Address line", with: "837 Auer Divide"
      fill_in "Postal code", with: "15721"

      click_on "Submit"
    end

    wait_for_pending_requests

    assert_attributes user.reload, address: "837 Auer Divide",
                                   city: "Ahmedabad",
                                   country: "IN",
                                   first_name: "John",
                                   last_name: "Doe",
                                   phone_number: "+12015550123",
                                   province: "GJ",
                                   zip_code: "15721"
  end
end
