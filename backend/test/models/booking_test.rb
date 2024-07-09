# frozen_string_literal: true

require "test_helper"

class BookingTest < ActiveSupport::TestCase
  test "pax presence for dine-in booking" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])

    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking_table = build(:booking_table, floor_object: table)
    booking = build(
      :booking,
      booking_tables: [booking_table],
      booking_type: :dine_in,
      clocked_in_at: DateTime.current,
      restaurant: restaurant,
      user: user
    )

    assert_not booking.valid?
    assert_includes booking.errors[:pax], "can't be blank"

    booking.pax = 0

    assert_not booking.valid?
    assert_includes booking.errors[:pax], "must be greater than 0"

    booking.pax = 4

    assert booking.valid?
  end

  test "estimated duration absence for dine_in" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])
    floor_object = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking_table = build(:booking_table, floor_object: floor_object, name: floor_object.name)

    booking = build(
      :booking,
      booking_type: :dine_in,
      booking_tables: [booking_table],
      clocked_in_at: DateTime.current,
      restaurant: restaurant,
      pax: 1,
      user: user
    )

    assert booking.valid?

    booking.estimated_duration = "00:15"

    assert_not booking.valid?
  end

  test "validate_clocked_out_at" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])

    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                               booking_tables: [build(:booking_table, floor_object: table)])

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))

    ticket = create(:ticket, booking: booking)
    create(:ticket_item, ticket: ticket, item: item, status: :cancelled)
    ticket_item = create(:ticket_item, ticket: ticket, item: item, status: :queued)

    booking.update(clocked_out_at: 1.minute.ago)

    assert_equal "Item(s) still present in kitchen", booking.errors.full_messages.to_sentence
    assert_nil booking.reload.clocked_out_at

    ticket_item.update(status: :served)

    booking.update(clocked_out_at: 1.minute.ago)

    assert_equal "Unprocessed invoice(s)", booking.errors.full_messages.to_sentence
    assert_nil booking.reload.clocked_out_at

    invoice = create(:invoice, booking: booking)

    booking.update(clocked_out_at: 1.minute.ago)

    assert_equal "Unprocessed invoice(s)", booking.errors.full_messages.to_sentence
    assert_nil booking.reload.clocked_out_at

    invoice.update(status: "paid")

    booking.update(clocked_out_at: 1.minute.ago)

    assert booking.valid?
    assert_not_nil booking.reload.clocked_out_at
  end
end
