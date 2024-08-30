# frozen_string_literal: true

class ChangeQuantityToFloatInTicketItems < ActiveRecord::Migration[7.0]
  def down
    change_column :ticket_items, :quantity, :integer
  end

  def up
    change_column :ticket_items, :quantity, :float
  end
end
